import { createContext, useContext, useEffect, useState } from "react";
import { ModuleCacheMap } from "vite/runtime"
import { useSpotifyAuthContext } from "./SpotifyAuthProvider";


export const defaultProfileData = {

    userId: "",
    email: "",
    uri: "",
    link: "",
    profileImage: ""
}

// export const defaultProfileData
// improt {defaultProfileData} from "./SpotifyProfileProvider.jsx"
//
// export default const defaultProfileData
// import defaultProfileData from "./SpofityProfileProvider.jsx"

export const SpotifyProfileContext = createContext(defaultProfileData);

export function useSpotifyProfileData() {
    return useContext(SpotifyProfileContext);
}

export function SpotifyProfileProvider({children}) {

    let [profileData, setProfileData] = useState(defaultProfileData);
    
    // Access auth data from AuthProvider so that we can make more fetch requests
    let {userAuthData} = useSpotifyAuthContext();

    async function fetchProfileData(accessToken){
        const result = await fetch(
            "https://api.spotify.com/v1/me",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return await result.json();
    }

    useEffect(() => {
        // If auth data has an access token, start making fetch requests, then setState
        if (userAuthData && userAuthData.access_token) {
            fetchProfileData(userAuthData.access_token).then(profileData => {
                setProfileData(profileData);
            })
        }

        // Whenever auth data changes, check it and maybe make fetch requests
    }, [userAuthData]);

    return (
        <SpotifyProfileContext.Provider value={profileData}>
            {children}
        </SpotifyProfileContext.Provider>
    )
}