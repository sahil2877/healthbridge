/**
 * One-time data migration: copy every collection from a SOURCE MongoDB to a
 * DEST MongoDB (e.g. local -> MongoDB Atlas). Copies all documents (preserving
 * _id) and recreates indexes. Safe to re-run: each destination collection is
 * cleared before the copy.
 *
 * Usage (Git Bash):
 *   SOURCE_URI="mongodb://127.0.0.1:27017/healthbridge" \
 *   DEST_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/healthbridge" \
 *   node scripts/migrateToAtlas.js
 *
 * SOURCE_URI defaults to the local healthbridge DB if not provided.
 * Both URIs MUST include the database name (the /healthbridge part).
 */
const { MongoClient } = require('mongodb');

async function main() {
  const SOURCE = process.env.SOURCE_URI || 'mongodb://127.0.0.1:27017/healthbridge';
  const DEST = process.env.DEST_URI;

  if (!DEST) {
    console.error('❌ DEST_URI is required (your Atlas connection string, including /healthbridge).');
    process.exit(1);
  }

  const src = new MongoClient(SOURCE);
  const dst = new MongoClient(DEST);
  await src.connect();
  await dst.connect();

  const srcDb = src.db(); // database taken from the URI path
  const dstDb = dst.db();
  if (!srcDb.databaseName || !dstDb.databaseName) {
    console.error('❌ Both SOURCE_URI and DEST_URI must include a database name (e.g. .../healthbridge).');
    process.exit(1);
  }

  console.log(`Source: ${srcDb.databaseName}  ->  Dest: ${dstDb.databaseName}`);

  const collections = await srcDb.listCollections({}, { nameOnly: true }).toArray();
  console.log(`Found ${collections.length} collections.\n`);

  let totalDocs = 0;
  for (const { name } of collections) {
    if (name.startsWith('system.')) continue;

    const docs = await srcDb.collection(name).find({}).toArray();
    await dstDb.collection(name).deleteMany({}); // make the script re-runnable
    if (docs.length) {
      await dstDb.collection(name).insertMany(docs, { ordered: false });
    }

    // Recreate non-default indexes (unique constraints etc.)
    const indexes = await srcDb.collection(name).indexes();
    for (const idx of indexes) {
      if (idx.name === '_id_') continue;
      const { key, name: indexName, v, ns, background, ...options } = idx;
      try {
        await dstDb.collection(name).createIndex(key, { name: indexName, ...options });
      } catch (e) {
        console.warn(`  (index "${indexName}" on ${name} skipped: ${e.message})`);
      }
    }

    totalDocs += docs.length;
    console.log(`  ${name}: ${docs.length} docs copied`);
  }

  await src.close();
  await dst.close();
  console.log(`\n✅ Migration complete — ${totalDocs} documents copied to Atlas.`);
}

main().catch((e) => {
  console.error('❌ Migration failed:', e.message);
  process.exit(1);
});
