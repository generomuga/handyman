class Validation {

    isEmailEmpty(text) {
        if (text.trim() === '') {
            return [true, 'Please input your email']
        }
        else {
            return [false, '']
        }
    }

    isEmailInvalid(text) {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        if (pattern.test(text) === false) {
            return [true, 'Please input valid email'];
        }
        else {
            return [false, '']
        }
    }

    isPasswordEmpty(text) {
        if (text.trim() === '') {
            // console.log('Empty password new')
            return [true, 'Please input your password']
        }
        else {
            return [false, '']
        }
    }

    isPasswordInvalid(text) {
        if (text.length < 8 || text.trim() === '') {
            // console.log('Invalid password new')
            return [true, 'Please input valid password (atleast 8 characters)']
        }
        else {
            return [false, '']
        }
    }

    isPasswordUnequal(text1,text2) {
        if (text1 != text2) {
            // console.log('Password didnt match new')
            return [true, "Your password didn't match"];
        }
        else {
            return [false, '']
        }
    }

    isTermsAndConditionNotAccepted(isAgree) {
        if (isAgree === false) {
            return [true, 'Please agree on Terms and Condition']
        } 
        else {
            return [false, '']
        }
    }

}

const validation = new Validation();

export default validation;