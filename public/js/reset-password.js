document.addEventListener('DOMContentLoaded', () => {

    const translations = {
        english: {
            header: "Reset Password",
            passwordLabel: "New password",
            passwordPlaceholder: "Enter password",
            confirmPasswordPlaceholder: "Confirm password",
            successful: 'Password successfully changed.',
            parameterPassword: "from 3 to 15 characters",
            submitButton: "Save password",
            passwordMatchError: "Passwords don't match",
            passwordLengthError: "Password must be at least 8 characters",
            passwordStrengthError: "Password must contain at least one number, one lowercase and one uppercase letter",
            serverError: "The server is not available. Please try again."
        },
        thai: {
            header: "รีเซ็ตรหัสผ่าน",
            passwordLabel: "รหัสผ่านใหม่",
            passwordPlaceholder: "ใส่รหัสผ่าน",
            confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
            parameterPassword: "จาก 3 ถึง 15 ตัวอักษร",
            successful: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
            submitButton: "บันทึกรหัสผ่าน",
            passwordMatchError: "รหัสผ่านไม่ตรงกัน",
            passwordLengthError: "รหัสผ่านต้องมีอย่างน้อย 8 อักขระ",
            passwordStrengthError: "รหัสผ่านต้องมีอย่างน้อยหนึ่งตัวเลข หนึ่งตัวพิมพ์เล็ก และหนึ่งตัวพิมพ์ใหญ่",
            serverError: "เซิร์ฟเวอร์ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"
        },
        russian: {
            header: "Сброс пароля",
            passwordLabel: "Новый пароль",
            passwordPlaceholder: "Введите пароль",
            successful: 'Пароль успешно изменен.',
            confirmPasswordPlaceholder: "Подтвердите пароль",
            parameterPassword: "от 3 до 15 символов",
            submitButton: "Сохранить пароль",
            passwordMatchError: "Пароли не совпадают",
            passwordLengthError: "Пароль должен быть не менее 8 символов",
            passwordStrengthError: "Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву",
            serverError: "Сервер недоступен. Пожалуйста, попробуйте позже."
        }
    };
    
    const clientLang = localStorage.getItem('clientLang') || 'english';
    const translation = translations[clientLang] || translations['english'];

    const restorePassWrapp = document.querySelector('.restorePassword_wrapp');
    const token = restorePassWrapp.dataset.token;

    restorePassWrapp.innerHTML = `
        <h2>${translation.header}</h2>
        <form id="resetForm">
            <label for="password">${translation.passwordLabel}:</label>
            <input type="password" name="password" id="password" placeholder="${translation.passwordPlaceholder}" required>
            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="${translation.confirmPasswordPlaceholder}" required>
            <div id="passwordError" class="error-message"></div>
            <button class="header_btn-sign btnRestorePassword" type="submit" disabled>${translation.submitButton}</button>
        </form>`;

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const submitButton = document.querySelector('.btnRestorePassword');

    function formErrorMessage(text, block) {
        block.textContent = text;
        block.style.display = 'block';
        submitButton.disabled = true;
    }

    function formClearMessage(block) {
        block.textContent = '';
        block.style.display = 'none';
        submitButton.disabled = false;
    }

    function validatePassword() {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/;

        if (password.value.length < 8) {
            formErrorMessage(translation.passwordLengthError, passwordError);
        } else if (!passwordRegex.test(password.value)) {
            formErrorMessage(translation.passwordStrengthError, passwordError);
        } else if (password.value !== confirmPassword.value) {
            formErrorMessage(translation.passwordMatchError, passwordError);
        } else {
            formClearMessage(passwordError);
        }
    }

    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validatePassword);

    document.getElementById('resetForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        validatePassword();
        
        if (submitButton.disabled) {
            return;
        }

        try {
            const response = await fetch(`/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password.value,
                    confirmPassword: confirmPassword.value
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Пароль успешно сброшен, перенаправляем на страницу входа
                restorePassWrapp.innerHTML = '';
                restorePassWrapp.innerHTML = `
                    <h3>${translation.successful}</h3>
                `;
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                // Отображаем сообщение об ошибке
                formErrorMessage(result.message, passwordError);
            }
        } catch (error) {
            console.error('Error:', error);
            formErrorMessage(translation.serverError, passwordError);
        }
    });

    validatePassword();
});





// document.addEventListener('DOMContentLoaded', () => {

//     const translations = {
//         english: {
//             header: "Reset Password",
//             passwordLabel: "New password",
//             passwordPlaceholder: "Enter password",
//             confirmPasswordPlaceholder: "Confirm password",
//             parameterPassword: "from 3 to 15 characters",
//             submitButton: "Save password",
//             passwordMatchError: "Passwords don't match",
//             passwordLengthError: "Password must be at least 8 characters",
//             passwordStrengthError: "Password must contain at least one number, one lowercase and one uppercase letter",
//             serverError: "The server is not available. Please try again."
//         },
//         thai: {
//             header: "รีเซ็ตรหัสผ่าน",
//             passwordLabel: "รหัสผ่านใหม่",
//             passwordPlaceholder: "ใส่รหัสผ่าน",
//             confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
//             parameterPassword: "จาก 3 ถึง 15 ตัวอักษร",
//             submitButton: "บันทึกรหัสผ่าน",
//             passwordMatchError: "รหัสผ่านไม่ตรงกัน",
//             passwordLengthError: "รหัสผ่านต้องมีอย่างน้อย 8 อักขระ",
//             passwordStrengthError: "รหัสผ่านต้องมีอย่างน้อยหนึ่งตัวเลข หนึ่งตัวพิมพ์เล็ก และหนึ่งตัวพิมพ์ใหญ่",
//             serverError: "เซิร์ฟเวอร์ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"
//         },
//         russian: {
//             header: "Сброс пароля",
//             passwordLabel: "Новый пароль",
//             passwordPlaceholder: "Введите пароль",
//             confirmPasswordPlaceholder: "Подтвердите пароль",
//             parameterPassword: "от 3 до 15 символов",
//             submitButton: "Сохранить пароль",
//             passwordMatchError: "Пароли не совпадают",
//             passwordLengthError: "Пароль должен быть не менее 8 символов",
//             passwordStrengthError: "Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву",
//             serverError: "Сервер недоступен. Пожалуйста, попробуйте позже."
//         }
//     };
    
//     const clientLang = localStorage.getItem('clientLang') || 'english';
//     const translation = translations[clientLang] || translations['english'];

//     const restorePassWrapp = document.querySelector('.restorePassword_wrapp');
//     const token = restorePassWrapp.dataset.token;

//     restorePassWrapp.innerHTML = `
//         <h2>${translation.header}</h2>
//         <form action="/reset-password/${token}" method="POST" id="resetForm">
//             <label for="password">${translation.passwordLabel}:</label>
//             <input type="password" name="password" id="password" placeholder="${translation.passwordPlaceholder}" required>
//             <input type="password" name="confirmPassword" id="confirmPassword" placeholder="${translation.confirmPasswordPlaceholder}" required>
//             <div id="passwordError" class="error-message"></div>
//             <button class="header_btn-sign btnRestorePassword" type="submit" disabled>${translation.submitButton}</button>
//         </form>`;

//     const password = document.getElementById('password');
//     const confirmPassword = document.getElementById('confirmPassword');
//     const passwordError = document.getElementById('passwordError');
//     const submitButton = document.querySelector('.btnRestorePassword');

//     function formErrorMessage(text, block) {
//         block.textContent = text;
//         block.style.display = 'block';
//         submitButton.disabled = true;
//     }

//     function formClearMessage(block) {
//         block.textContent = '';
//         block.style.display = 'none';
//         submitButton.disabled = false;
//     }

//     function validatePassword() {
//         const passwordRegex = /^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/;

//         if (password.value.length < 8) {
//             formErrorMessage(translation.passwordLengthError, passwordError);
//         } else if (!passwordRegex.test(password.value)) {
//             formErrorMessage(translation.passwordStrengthError, passwordError);
//         } else if (password.value !== confirmPassword.value) {
//             formErrorMessage(translation.passwordMatchError, passwordError);
//         } else {
//             formClearMessage(passwordError);
//         }
//     }

//     password.addEventListener('input', validatePassword);
//     confirmPassword.addEventListener('input', validatePassword);

//     document.getElementById('resetForm').addEventListener('submit', function(event) {
//         validatePassword();
//         if (submitButton.disabled) {
//             event.preventDefault();
//         }
//     });

//     validatePassword();
// });