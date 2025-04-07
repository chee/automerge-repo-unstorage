import {describe} from "vitest"
import {runStorageAdapterTests} from "./storage-adapter-tests.ts"
import UnstorageAdapter from "../source/unstorage-adapter.ts"
import {createStorage} from "unstorage"
import fsDriver from "unstorage/drivers/fs"

// describe("memory", function () {
// 	runStorageAdapterTests(async function () {
// 		const storage = createStorage()
// 		const adapter = new UnstorageAdapter(storage)
// 		return {adapter, async teardown() {}}
// 	})
// })

describe("fs", function () {
	runStorageAdapterTests(async function () {
		const storage = createStorage({
			driver: fsDriver({base: "./.test-storage"}),
		})
		const adapter = new UnstorageAdapter(storage)
		return {adapter, async teardown() {}}
	})
})

// import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs"

// describe("netlify", function () {
// 	runStorageAdapterTests(async function () {
// 		const storage = createStorage({
// 			driver: netlifyBlobsDriver({
// 				name: process.env.NETLIFY_BLOB_NAME,
// 				token: process.env.NETLIFY_TOKEN
// 				siteID: process.env.NETLIFY_SITE_ID
// 			}),
// 		})
// 		const adapter = new UnstorageAdapter(storage)
// 		return {adapter, async teardown() {}}
// 	})
// })

import githubDriver from "unstorage/drivers/github"

describe("github", function () {
	runStorageAdapterTests(async function () {
		const storage = createStorage({
			driver: githubDriver({
				repo: "chee/",
			}),
		})
		const adapter = new UnstorageAdapter(storage)
		return {adapter, async teardown() {}}
	})
})
