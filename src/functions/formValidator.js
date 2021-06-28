class FormValidator {

    isEmailEmpty(text) {
        if (text.trim() === '') {
            // console.log('Empty email new')
            return true
        }
        else {
            return false
        }
    }

    isNotValidEmail(text) {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (pattern.test(text) === false) {
            // console.log('Invalid email new')
            return true;
        }
        else {
            return false
        }
    }

    isPasswordEmpty(text) {
        if (text.trim() === '') {
            // console.log('Empty password new')
            return true
        }
        else {
            return false
        }
    }

    isNotValidPassword(text) {
        if (text.length < 8 || text.trim() === '') {
            // console.log('Invalid password new')
            return true
        }
        else {
            return false
        }
    }

    isNotSameText(text1,text2) {
        if (text1 != text2) {
            // console.log('Password didnt match new')
            return true
        }
        else {
            return false
        }
    }

}

const formValidator = new FormValidator();

export default formValidator;