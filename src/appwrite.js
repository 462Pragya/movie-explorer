import { Client, Databases, ID , Query} from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; 
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const setEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()

.setEndpoint(setEndpoint) // Your Appwrite Endpoint
.setProject(PROJECT_ID);

 const database = new Databases(client);

export const updateSearchCount = async (searchTerm,movie) => 
{
//console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);

//1. use appwrite sdk to check if the searchTerm exists in the database
try{
   const result = await database.listDocuments(DATABASE_ID, 
    COLLECTION_ID,   [Query.equal('searchTerm', searchTerm)]);
//2. if it does update the count by 1
    if(result.documents.length > 0) {
        const doc= result.documents[0];

        await database.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            doc.$id,
            {
                count: doc.count + 1
            }
        );
    }
//3. if it does not, create a new document with the searchTerm and count set to 1
    else{
        await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                searchTerm: searchTerm,
                count: 1,
                movieId: movie.id,
                
                poster_url:  `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            }
        );
    }
}

catch (error) {
  console.error( error);
 
}


}

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(5),
             Query.orderDesc('count')]
        )
        return result.documents;
    }
    catch (error) {
        console.error( error);
        
    }
}