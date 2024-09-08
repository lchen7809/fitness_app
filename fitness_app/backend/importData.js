const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

const url = 'mongodb+srv://lchen044:D1feO3qOMgvW4zIx@cluster0.xoh5n5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'test';
const collectionName = 'workouts';

async function importData() {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = JSON.parse(fs.readFileSync('./json/workouts.json'));

    data.forEach(doc => {
        if (typeof doc._id === 'string' && ObjectId.isValid(doc._id)) {
            doc._id = new ObjectId(doc._id);
        }
    });

    await collection.insertMany(data);

    console.log('Data imported successfully');
    await client.close();
}

importData().catch(console.error);
