export const useGetUserInfo = () => {
    if(localStorage.getItem("auth") !== null){
        const {name, profilePhoto, userId, isAuth} = JSON.parse(localStorage.getItem("auth"));
        return { name, profilePhoto, userId, isAuth };
    }
    return {isAuth:false};
}