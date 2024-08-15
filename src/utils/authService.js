/**
 * This is Authentication logic to control 
 * signing in, signing out and checking the authentication status
 */

const authService ={

    isAuthenticated:false,//default status

    signIn(callback){
        authService.isAuthenticated =true;
        localStorage.setItem('isAuthenticated', true);
        setTimeout(callback, 3000);
    },

    signOut(callback){
        authService.isAuthenticated =false;
        //change status
        localStorage.setItem('isAuthenticated', 'false');

        /* //remove all items from localStrage 
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('avatar'); */

        

        setTimeout(callback,300);
    },

    // this is return true (if isAuthenticated is same as true) or false
    getAuthStatus() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }


};

export default authService