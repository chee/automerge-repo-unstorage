## automerge-repo-unstorage

An [Automerge](https://automerge.org/)
[Repo](https://automerge.org/docs/repositories) [Storage
adapter](https://automerge.org/docs/repositories/storage/) for
[unstorage](https://unstorage.unjs.io/)

## usage

```bash
pnpm add automerge-repo-unstorage
```

```ts
import {BrowserWebSocketClientAdapter} from "@automerge/automerge-repo-network-websocket"
import {Repo} from "@automerge/automerge-repo"
import UnstorageAdapter from "automerge-repo-unstorage"
// e.g. using netlify blobs
// see https://unstorage.unjs.io/drivers for other options
import {createStorage} from "unstorage"
import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs"

export default async function startAutomerge() {
	const storage = createStorage({
		driver: netlifyBlobsDriver({
			name: "automerge",
			siteID: process.env.NETLIFY_SITE_ID,
			token: process.env.NETLIFY_TOKEN,
		}),
	})

	const repo = new Repo({
		storage: new UnstorageAdapter(storage),
		network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
	})
	return repo
}
```
