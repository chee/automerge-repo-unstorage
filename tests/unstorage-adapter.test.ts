import {runStorageAdapterTests} from "./storage-adapter-tests.ts"
import UnstorageAdapter from "../source/unstorage-adapter.ts"
import {createStorage, type Driver} from "unstorage"
import fsDriver from "unstorage/drivers/fs"

function createStorageAdapterTest(driver: Driver) {
	return async function () {
		const storage = createStorage({driver})
		const adapter = new UnstorageAdapter(storage)
		return {adapter, async teardown() {}}
	}
}

runStorageAdapterTests(
	createStorageAdapterTest(fsDriver({base: "./.test-storage"})),
	"fs"
)

function go(name: string, driver: Driver) {
	runStorageAdapterTests(createStorageAdapterTest(driver), name)
}

go("fs", fsDriver({base: "./.test-storage"}))
import nullDriver from "unstorage/drivers/null"
go("null", nullDriver())
import {createDatabase} from "db0"
import dbDriver from "unstorage/drivers/db0"
import sqlite from "db0/connectors/better-sqlite3"
const database = createDatabase(sqlite({}))
go("db", dbDriver({database}))

// import lruCacheDriver from "unstorage/drivers/lru-cache"
// go("lru", lruCacheDriver({max: 100000}))
