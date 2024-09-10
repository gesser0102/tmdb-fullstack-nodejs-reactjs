
import axios from "axios";


const url = process.env.BASE_URL;
const key = process.env.TMDB_KEY;


const requests = {
    get: async (url) => {
        const response = await axios.get(url, {
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "identity"
            }
            
        });
        return response.data;
    }
};


const baseUrl = (endpoint, params) => {
    const query = new URLSearchParams({
      ...params,
      language: 'pt-BR'
    }).toString();
    return `${url}${endpoint}?api_key=${key}&${query}`;
  };

// API Endpoints
const tmdbRequests = {
    mediaList: ({mediaType, mediaCategory, page }) => baseUrl(`/${mediaType}/${mediaCategory}`, {page}),
    mediaDetails: ({mediaType, mediaId}) => baseUrl(`/${mediaType}/${mediaId}`, {}),
    mediaGenres: ({mediaType}) => baseUrl(`/genre/${mediaType}/list`, {}),
    mediaSearch: ({mediaType, query, page}) => baseUrl(`/search/${mediaType}`, {query, page}),
    mediaImages: ({mediaType, mediaId}) => baseUrl(`/${mediaType}/${mediaId}/images`, {})
};


// API Methods
const tmdbApi = {
    mediaList: async ({ mediaType, mediaCategory, page }) => await requests.get(
        tmdbRequests.mediaList({ mediaType, mediaCategory, page })
      ),
      mediaDetail: async ({ mediaType, mediaId }) => await requests.get(
        tmdbRequests.mediaDetails({ mediaType, mediaId })
      ),
      mediaGenres: async ({ mediaType }) => await requests.get(
        tmdbRequests.mediaGenres({ mediaType })
      ),
      mediaImages: async ({ mediaType, mediaId }) => await requests.get(
        tmdbRequests.mediaImages({ mediaType, mediaId })
      ),
      mediaSearch: async ({ mediaType, query, page }) => await requests.get(
        tmdbRequests.mediaSearch({ mediaType, query, page })
      )
};

// Export the API object
export default tmdbApi;
