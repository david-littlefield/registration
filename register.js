function removeWhitespaceFromHtml() {
    const html = document.querySelector("html");
    const closingBracketPattern = /(>\s+)/gm;
    const openingBracketPattern = /(\s+<)/gm;
    let innerHtml = html.innerHTML;
    innerHtml = innerHtml.replace(closingBracketPattern, ">");
    innerHtml = innerHtml.replace(openingBracketPattern, "<");
    html.innerHTML = innerHtml;
}

function addAnimationToTextFields() {
    const textFields = document.querySelectorAll(".text-field");
    textFields.forEach(function(textField) {
        addFocusEventToTextField(textField);
        addBlurEventToTextField(textField);
        addInputEventToTextField(textField);
    });
}

function addFocusEventToTextField(textField) {
    if (textField) {
        textField.addEventListener("focus", function(event) {
            const animatedTextFieldContainer = event.target.closest(".animated-text-field-container");
            if (animatedTextFieldContainer) {
                animatedTextFieldContainer.setAttribute("focus", "");
            }
        });
    }
}

function addBlurEventToTextField(textField) {
    if (textField) {
        textField.addEventListener("blur", function(event) {
            const animatedTextFieldContainer = event.target.closest(".animated-text-field-container");
            if (animatedTextFieldContainer) {
                animatedTextFieldContainer.removeAttribute("focus");
            }
        });
    }
}

function addInputEventToTextField(textField) {
    if (textField) {
        textField.addEventListener("input", function(event) {
            const animatedTextFieldContainer = event.target.closest(".animated-text-field-container");
            if (animatedTextFieldContainer) {
                if (textField.value && !animatedTextFieldContainer.hasAttribute("text")) {
                    animatedTextFieldContainer.setAttribute("text", "");
                }
                if (!textField.value && animatedTextFieldContainer.hasAttribute("text")) {
                    animatedTextFieldContainer.removeAttribute("text");
                }
            }
        });
    }
}

function addKeypressEventToTextFields() {
    const textFields = document.querySelectorAll(".text-field");
    textFields.forEach(function(textField) {
        addEnterKeypressEventToTextField(textField);
    });
}

function addEnterKeypressEventToTextField(textField) {
    if (textField) {
        textField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                const button = document.querySelector(".next-button");
                button.click();
            }
        });
    }
}

function addChangeEventToTextField() {
    const textField = document.querySelector("#email-address");
    if (textField) {
        textField.addEventListener("change", function(event) {
            emailAddressIsValid();
        });
    }
}

function togglePasswordVisibility() {
    const checkbox = document.querySelector(".checkbox");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm-password");
    if (checkbox && password && confirmPassword) {
        if (checkbox.checked) {
            password.setAttribute("type", "text");
            confirmPassword.setAttribute("type", "text");
        }
        else {
            password.setAttribute("type", "password");
            confirmPassword.setAttribute("type", "password");
        }
    }
}

function addClickEventToCheckbox() {
    const checkbox = document.querySelector(".checkbox");
    if (checkbox) {
        checkbox.addEventListener("click", togglePasswordVisibility);
    }
}

function addClickEventToLabel() {
    const label = document.querySelector(".checkbox-label");
    if (label) {
        label.addEventListener("click", function(event) {
            const checkbox = document.querySelector(".checkbox");
            checkbox.checked = !checkbox.checked ? true : false;
            togglePasswordVisibility();
        });
    }
}

function addClickEventToButton() {
    const button = document.querySelector(".next-button");
    if (button) {
        button.addEventListener("click", async function(event) {
            const passwordIsValid = validatePassword();
            const emailIsValid = await validateEmail();
            const nameIsValid = validateName();
            if (nameIsValid && emailIsValid && passwordIsValid) {
                const form = document.querySelector("form");
                form.submit();
            }
        });
    }
}

function focusOnTextField() {
    const textField = document.querySelector("#first-and-last-name-text-fields .text-field");
    textField.focus();
}

function validateName() {
    hideTextFieldError("#first-name");
    hideTextFieldError("#first-name");
    let firstName = document.querySelector("#first-name");
    let lastName = document.querySelector("#last-name");
    if (!firstName && !lastName) {
        // error
    }
    if (firstName) {
        firstName = firstName.value;
        firstName = firstName.trim();
    }
    if (lastName) {
        lastName = lastName.value;
        lastName = lastName.trim();
    }
    if (firstName.length === 0 && lastName.length === 0) {
        showTextFieldError("#last-name", "Enter first and last names");
        showTextFieldError("#first-name", "Enter first and last names");
        return false;
    }
    else if (firstName.length === 0) {
        showTextFieldError("#first-name", "Enter first name");
        return false;
    }
    else if (lastName.length === 0) {
        showTextFieldError("#last-name", "Enter last name");
        return false;
    }
    else if (firstName.length === 1) {
        showTextFieldError("#first-name", "Are you sure you entered your name correctly?");
        return false;
    }
}

async function validateEmail() {
    let emailAddress = document.querySelector("#email-address");
    if (!emailAddress) {
        // error
    }
    if (emailAddress) {
        emailAddress = emailAddress.value;
        emailAddress = emailAddress.trim();
    }
    if (emailAddress.length === 0) {
        showTextFieldError("#email-address", "Enter an email address");
        return false;
    }
    else if (characterCountInText("@", emailAddress) === 0) {
        showTextFieldError("#email-address", "Don't forget to include the '@'.");
        return false;
    }
    else if (characterCountInText("@", emailAddress) > 1) {
        showTextFieldError("#email-address", "Enter an email address with only one '@'.");
        return false;
    }
    else if (patternExistsInText(/^@/, emailAddress)) {
        showTextFieldError("#email-address", "Enter a user name before the '@'.");
        return false;
    }
    else if (patternExistsInText(/[a-zA-Z0-9\-_.]+@$/, emailAddress)) {
        showTextFieldError("#email-address", "Enter a domain name after the '@'.");
        return false;
    }
    else if (patternExistsInText(/[^ -~]+/, emailAddress)) {
        showTextFieldError("#email-address", "Only these characters are allowed: letters, numbers, and some special characters.");
        return false;
    }
    else if (!patternExistsInText(/[a-zA-Z0-9\-_.]+@[a-zA-Z0-9\-_.]+\.[a-zA-Z]/, emailAddress)) {
        showTextFieldError("#email-address", "This email address is not valid.");
        return false;
    }
    else if (await emailExistsInDatabase(emailAddress)) {
        showTextFieldError("#email-address", "This email is already in use.");
        return false;
    }
    return true;
}

function validatePassword() {
    hideTextFieldError("#password");
    hideTextFieldError("#confirm-password");
    let password = document.querySelector("#password");
    let confirmPassword = document.querySelector("#confirm-password");
    if (!password && !confirmPassword) {
        // error
    }
    if (password) {
        password = password.value;
    }
    if (confirmPassword) {
        confirmPassword = confirmPassword.value;
    }
    if (password.length === 0) {
        showTextFieldError("#password", "Enter a password");
        return false;
    }
    else if (password.charAt(0) === " " || password.charAt(password.length - 1) === " ") {
        showTextFieldError("#password", "Your password can't start or end with a blank space");
        return false;
    }
    else if (password.length < 8) {
        showTextFieldError("#password", "Use 8 characters or more for your password");
        return false;
    }
    else if (confirmPassword.length === 0) {
        showTextFieldError("#confirm-password", "Confirm your password");
        return false;
    }
    else if (password !== confirmPassword) {
        showTextFieldError("#confirm-password", "Those passwords didn't match. Try again.");
        clearTextFieldValue("#confirm-password");
        return false;
    }
    else if (!passwordIsStrongEnough(password)) {
        showTextFieldError("#password", "Please choose a stronger password. Try a mix of letters, numbers, and symbols.");
        clearTextFieldValue("#password");
        clearTextFieldValue("#confirm-password");
        return false;
    }
    else if (patternExistsInText(/[^ -~]+/, password)) {
        showTextFieldError("#password", "Only use letters, numbers, and common punctuation characters");
        return false;
    }
    return true;
}

function showTextFieldError(selector = "", text = "") {
    const textField = document.querySelector(selector);
    if (textField) {
        const animatedTextFieldContainer = textField.closest(".animated-text-field-container");
        if (animatedTextFieldContainer) {
            animatedTextFieldContainer.setAttribute("error", "");
        }
        const textFieldGroup = textField.closest(".text-field-group");
        if (textFieldGroup) {
            const textFieldFeedbackContainer = textFieldGroup.getElementsByClassName("text-field-feedback-container");
            if (textFieldFeedbackContainer.length > 0) {
                textFieldFeedbackContainer[0].setAttribute("error", "");
            }
            const textFieldErrorText = textFieldGroup.getElementsByClassName("text-field-error-text");
            if (textFieldErrorText.length > 0) {
                textFieldErrorText[0].innerText = text;
            }
        }
        textField.focus();
    }
}

function hideTextFieldError(selector = "") {
    const textField = document.querySelector(selector);
    if (textField) {
        const animatedTextFieldContainer = textField.closest(".animated-text-field-container");
        if (animatedTextFieldContainer) {
            animatedTextFieldContainer.removeAttribute("error", "");
        }
        const textFieldGroup = textField.closest(".text-field-group");
        if (textFieldGroup) {
            const textFieldFeedbackContainer = textFieldGroup.getElementsByClassName("text-field-feedback-container");
            if (textFieldFeedbackContainer.length > 0) {
                textFieldFeedbackContainer[0].removeAttribute("error", "");
            }
            const textFieldErrorText = textFieldGroup.getElementsByClassName("text-field-error-text");
            if (textFieldErrorText.length > 0) {
                textFieldErrorText[0].innerText = "";
            }
        }
    }
    textField.blur();
}

function characterCountInText(character = "", text = "") {
    let count = 0;
    for (var index = 0; index < text.length; index++) {
        if (text[index] === character) {
            count += 1;
        }
    }
    return count;
}

function patternExistsInText(pattern = "", text = "") {
    return text.match(pattern) != null;
}

async function emailExistsInDatabase(emailAddress = "") {
    return await fetch(`http://localhost:3000/users/check/${emailAddress}`)
        .then(function(response) {
            return response.json();
        }).then(function(result) {
        if (!result.emailExists) {
            return false;
        }
        return true;
        });
}

function clearTextFieldValue(selector = "") {
    const textField = document.querySelector(selector);
    if (textField) {
        textField.value = "";
    }
}

function passwordIsStrongEnough(password = "") {
    let score = 0;
    if (patternExistsInText(/[a-z]/, password)) {
        score += 1;
    }
    if (patternExistsInText(/[A-Z]/, password)) {
        score += 1;
    }
    if (patternExistsInText(/[0-9]/, password)) {
        score += 1;
    }
    if (patternExistsInText(/[!-\/]/, password)) {
        score += 1;
    }
    if (patternExistsInText(/[:-@]/, password)) {
        score += 1;
    }
    if (patternExistsInText(/[\[-`]]/, password)) {
        score += 1;
    }
    if (patternExistsInText(/[\{-~]]/, password)) {
        score += 1;
    }
    return score >= 3;
}

removeWhitespaceFromHtml();
addAnimationToTextFields();
addKeypressEventToTextFields();
addChangeEventToTextField();
addClickEventToCheckbox();
addClickEventToLabel();
addClickEventToButton();
focusOnTextField();