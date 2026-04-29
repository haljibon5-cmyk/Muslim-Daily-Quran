import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

try {
  initializeApp();
  console.log("App initialized.");
  getAuth().listUsers(1).then(() => console.log("Success")).catch(e => console.error("Auth error:", e.message));
} catch (e) {
  console.error("Init err:", e.message);
}
