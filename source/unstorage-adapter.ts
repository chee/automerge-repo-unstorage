import type {
	Chunk,
	StorageAdapterInterface,
	StorageKey,
} from "@automerge/automerge-repo/slim"
import type {Storage} from "unstorage"

export default class BrowserFileSystemStorageAdapter
	implements StorageAdapterInterface
{
	private storage: Storage

	constructor(storage: Storage) {
		this.storage = storage
	}

	private cache: Map<string, Uint8Array> = new Map()

	async load(storageKey: StorageKey): Promise<Uint8Array | undefined> {
		const key = getKey(storageKey)
		if (this.cache.has(key)) return this.cache.get(key)

		const content = await this.storage.getItemRaw<Uint8Array>(key)
		if (content) {
			this.cache.set(key, content)
			return content
		} else {
			return undefined
		}
	}

	async save(storageKey: StorageKey, data: Uint8Array): Promise<void> {
		const key = getKey(storageKey)
		this.cache.set(key, data)
		await this.storage.setItemRaw(key, data)
	}

	async remove(storageKey: StorageKey): Promise<void> {
		const key = getKey(storageKey)
		this.cache.delete(key)
		await this.storage.removeItem(key)
	}

	async loadRange(storageKeyPrefix: StorageKey): Promise<Chunk[]> {
		const keyfix = getKey(storageKeyPrefix)
		const listResult = this.storage.getKeys(keyfix)
		const chunks: Chunk[] = []
		const skip: string[] = []
		for (const [key, data] of this.cache.entries()) {
			if (key.startsWith(keyfix)) {
				skip.push(key)
				chunks.push({key: ungetKey(key), data})
			}
		}
		await listResult.then(list => {
			return list.map(async key => {
				if (skip.includes(key)) return
				const content = await this.storage.getItemRaw<Uint8Array>(key)
				if (content) {
					this.cache.set(key, content)
					chunks.push({key: ungetKey(key), data: content})
				}
			})
		})

		return chunks
	}

	async removeRange(storageKeyPrefix: StorageKey): Promise<void> {
		const keyfix = getKey(storageKeyPrefix)
		const listResult = this.storage.getKeys(keyfix)
		for (const key of this.cache.keys()) {
			if (key.startsWith(keyfix)) {
				this.cache.delete(key)
			}
		}

		await listResult.then(list => {
			return list.map(async key => {
				await this.storage.removeItem(key)
			})
		})
	}
}

function getCacheKeyFromFilePath(key: string[]) {
	return key.join("/")
}

function getFilePath(keyArray: string[]): string[] {
	const [firstKey, ...remainingKeys] = keyArray
	return [firstKey.slice(0, 2), firstKey.slice(2), ...remainingKeys]
}

function ungetFilePath(path: string[]) {
	const [firstKey, secondKey, ...remainingKeys] = path
	return [firstKey + secondKey, ...remainingKeys]
}

function getKey(storageKey: StorageKey) {
	return getCacheKeyFromFilePath(getFilePath(storageKey))
}

function ungetKey(storageKey: string) {
	return ungetFilePath(storageKey.split("/"))
}
