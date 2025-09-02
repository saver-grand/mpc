type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
    import {
      getFirestore,
      doc,
      setDoc,
      deleteDoc,
      serverTimestamp
    } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

    const firebaseConfig = {  
      apiKey: "AIzaSyBFTwwwFdPdWkMBLuPgp4X4eISjq1G_I5k",  
      authDomain: "honor-tv.firebaseapp.com",  
      projectId: "honor-tv",  
      storageBucket: "honor-tv.appspot.com",  
      messagingSenderId: "558886563379",  
      appId: "1:558886563379:web:c4baa6df86210da2737d46"  
    };  

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const codeInput = document.getElementById("code");
    const durationSelect = document.getElementById("duration");
    const messageEl = document.getElementById("message");

    const showMessage = (msg, color = "#00ff99") => {
      messageEl.textContent = msg;
      messageEl.style.color = color;
    };

    async function createCode() {
      const code = codeInput.value.trim();
      const duration = parseInt(durationSelect.value);

      if (code.length < 4) {
        showMessage("⚠️ Code must be at least 4 characters", "#ff6666");
        return;
      }

      try {
        await setDoc(doc(db, "codes", code), {
          duration,
          createdAt: serverTimestamp()
        });
        showMessage(`✅ Code "${code}" created for ${duration} ${duration > 1 ? "days" : "day"}`);
        codeInput.value = "";
      } catch (e) {
        console.error(e);
        showMessage("❌ Failed to create code", "#ff4444");
      }
    }

    async function deleteCode(code) {
      try {
        await deleteDoc(doc(db, "codes", code));
        showMessage(`🗑️ Code "${code}" deleted`, "#ffcc00");
      } catch (e) {
        console.error(e);
        showMessage("❌ Failed to delete code", "#ff4444");
      }
    }

    document.getElementById("createBtn").addEventListener("click", createCode);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") createCode();
    });
