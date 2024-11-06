import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBjkmMFTJFGSMqNJauLLKjnect7rOzdL2c",
    authDomain: "sia101-activity2-galaroz-1fdd1.firebaseapp.com",
    projectId: "sia101-activity2-galaroz-1fdd1",
    storageBucket: "sia101-activity2-galaroz-1fdd1.appspot.com",
    messagingSenderId: "252655190478",
    appId: "1:252655190478:web:00ed32115bb5ebcc03ab9f",
    measurementId: "G-ERFDL5QE0H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function sendWebhookNotification(action) {
    const webhookUrl = 'b84b609f-9331-433b-b1a8-15e8b57fd144@emailhook.site';
    const payload = {
        action: action,
        timestamp: new Date().toISOString(),
    };
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => console.log('Webhook notification sent:', response))
    .catch(error => console.error('Error sending webhook notification:', error));
}

window.registerUser = function() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const registerMessage = document.getElementById('registerMessage');
    const registerError = document.getElementById('registerError');

    registerMessage.textContent = '';
    registerError.textContent = '';

    if (!email || !password) {
        registerError.textContent = 'Please enter both email and password.';
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User registered:', userCredential.user);
            registerMessage.textContent = 'Registration successful! You can now log in.';
            sendWebhookNotification(`New user registered: ${email}`);
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
        })
        .catch((error) => {
            console.error('Error registering user:', error);
            registerError.textContent = 'Error: ' + error.message;
        });
};

window.loginUser = function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user);
            sendWebhookNotification(`User logged in: ${email}`);
            window.location.href = 'map.html';
        })
        .catch((error) => {
            console.error('Error logging in:', error.message);
            loginError.textContent = 'Error: ' + error.message;
        });
};


