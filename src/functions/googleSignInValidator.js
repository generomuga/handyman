import * as Google from 'expo-google-app-auth';

class GoogleSignInValidator {

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqualGoogle(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    // googleUser.getAuthResponse().id_token);
                    googleUser.idToken,
                    googleUser.accessToken
                );
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential).catch((error) => {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // The email of the user's account used.
                  var email = error.email;
                  // The firebase.auth.AuthCredential type that was used.
                  var credential = error.credential;
                  // ...
                });
            } 
            else {
                console.log('User already signed-in Firebase.');
            }
        });
    }


    isUserEqualGoogle = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    return true;
                }
            }
        }
        return false;
    }

    signInWithGoogleAsync = async() => {
        try {
            console.log('mgamga')
            const result = await Google.logInAsync({
                androidClientId: '876177652588-5fiqiq2vna74qg6aklen12vd1hpre723.apps.googleusercontent.com',
                iosClientId: '876177652588-s599pfq4cm2k0lotu9erv319kbn1ibh9.apps.googleusercontent.com',
            scopes: ['profile', 'email']}
            );
            if (result.type === 'success') {
                // onSignIn(result);
                return result.accessToken;
            } 
            else {
                return { cancelled: true };
            }
        } 
        catch (e) {
        return { error: true };
    }
        
  }
}

const googleSignInValidator = new GoogleSignInValidator();

export default googleSignInValidator;