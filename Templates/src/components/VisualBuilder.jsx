import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import { useAuth } from '../contexts/AuthContext';
import { Save, ArrowLeft, Loader2, LayoutTemplate, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import viLocale from '../utils/grapesjs-vi';
import { showToast, confirmAction } from '../utils/alertUtils';

const TEMPLATES = {
  beach: `
    <div style="font-family: 'Inter', sans-serif; color: #333; background-color: #fafafa;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600&display=swap');
        .cj-heading { font-family: 'Playfair Display', serif; }
        .cj-edge-beach { position: absolute; bottom: -1px; left: 0; right: 0; height: 35px; background-color: #fafafa; -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgMzAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCwxOC4zODQ2MjQ5OTI5MDYzNzUgMTAsMTYuOTk5MTM2ODM2NDQ2NzYgMjAsMTUuMTQwMjM2MjI3OTMwMzQzIDMwLDE4LjIxODA1NjA3MzM4OTU2MiA0MCwyMi4wMjY2NTE4NjgwODU3OCA1MCwxOC41NTM4OTMwNTc5OTY2NDYgNjAsMTYuOTczNzI1MDE0NTM1NDQgNzAsMTUuMTQxNDA1MzgxNjExNTEzIDgwLDE5Ljc1MTUxNjk1MTc1NDk0NCA5MCwxOS4xNTgxMTczODkzNzk4NCAxMDAsMjEuMzI2MDQxMDcwNDc4OTY1IDExMCwxOS43NDc1Njg5MzcyMTYwODQgMTIwLDIyLjg1MjcxOTkyODMwNzkwMiAxMzAsMTkuMDc0NTQ1Nzk2MTQ1MDc4IDE0MCwxOC4xNjI4MDI4MDA5NzY1ODYgMTUwLDE4LjQ4OTQ4NzIwNDY3OTg2IDE2MCwxNS4zMDA4MDk4NzIyODUyMTIgMTcwLDE1LjYyMDY3MTcxMTI0MjA5NCAxODAsMjIuNTAwNTg2NDI5NTAxMTQgMTkwLDIxLjkyNjYzODgzNjAyOTMgMjAwLDE4LjYyNjc4OTQyNzA5MjYwNCAyMTAsMTcuOTMwMTM1NjgzNzcyMzg4IDIyMCwxNS4xNzEyNTUyNzgyODQ0MyAyMzAsMjIuNDkzOTc2MzIyODE0NjkgMjQwLDIxLjA2NjgzNzQ2MjAxMDMxMiAyNTAsMTYuMzg5NTAxNTc3NjUwMDk0IDI2MCwxNS44NDEwNTk2NDI3OTY5ODMgMjcwLDIyLjE1ODIzNzI5MTcyMzk5MiAyODAsMjIuNzM3Mjc2MTA4Njc0MDg4IDI5MCwxNy4xNDExMDQwNjQ5NDU4MyAzMDAsMjIuNDAyMDg5NDc1NzkzODggMzEwLDE1LjQzOTM3MDc3NDkxMTQ0IDMyMCwyMS4zMDAwNjMyOTQ0ODcxNzggMzMwLDIxLjMwOTM1NzY5Njk2MTE3IDM0MCwyMS45Mzg5MDM2ODM2Njc2MDQgMzUwLDE4LjkwNDMzNDQ2NzMzMzI2OCAzNjAsMjIuMTk3NTMyOTA5NTkyMTg0IDM3MCwyMi40NTI4Mjc4ODkwMDEzNDggMzgwLDE1Ljg1NDU3OTA0NDM3NjAzMyAzOTAsMTUuMTg2NjY3Mzg1OTI1MDE4IDQwMCwyMC45OTk1MzgwNjkwOTA5MiA0MTAsMjIuNjcyOTM1NzgyMjAzNjQgNDIwLDE1Ljk0NTIzMTc1MTcxMjc3OSA0MzAsMjAuODgyNzIxMjczMzU2OTUgNDQwLDIwLjU3OTQzODI3MTE1NDA2IDQ1MCwyMi44MzUwNzgxOTQ5MzI5OCA0NjAsMjAuNzUwMzY4MDU5Mzk1NDQ1IDQ3MCwyMC44ODU5MzAwNTcxODM4NTYgNDgwLDE2LjQ1ODUxOTE0MTk4NjAzIDQ5MCwyMC41NzQ3ODYzMDc1NDI1MDMgNTAwLDE2Ljc3Mjk3NDYyNjkzMTMzMyA1MTAsMTcuODgyNTMxMDEyOTUyNzU0IDUyMCwxNS41MTY4MzM3Mzc2MTM1NDQgNTMwLDE1Ljc5OTc0MjA2MjE1NDg4OCA1NDAsMTYuODgxMzkyNjc3MDA1Mzg3IDU1MCwxOS42NDg3OTY3NDIzNDE4ODcgNTYwLDE2LjAxMjE2OTM5MzA4OTI4IDU3MCwxNy4wNzE1ODU2MjEzODYwMDYgNTgwLDE5LjU5NjU0NDIxMDc4NTI5IDU5MCwyMi4wMDIzMzU3MzIxMDA4OTYgNjAwLDE4LjY3OTExOTEzNTIzMzEzMyA2MTAsMjIuOTAwMjE4NDAyNTk3OTY4IDYyMCwyMC4wMDYzNTE2MjQ2Mzc0MzIgNjMwLDE2LjQ1MTgyODQyOTcwNTU0IDY0MCwxOS40MjgwMDEwOTc5MDQ3MjMgNjUwLDE3LjI5MzY0NTQ4NDM1MjggNjYwLDE4LjgwOTg4OTU0NDY5NDQxIDY3MCwxOC43NzkxNTg4NjE4Njg0MSA2ODAsMTguNTgxMzk3NDg3Mjk1MjI0IDY5MCwyMi40MDM0NzU2NjY4NDUyNiA3MDAsMTcuMzY4NTg5MjQzNzQ2MDcyIDcxMCwyMS41NDA5NjQ1Njc3NzE0ODIgNzIwLDIwLjkwNDA5NTc5MjgzNjkgNzMwLDIwLjE3NzIzMzQ4NzUxNDg0NCA3NDAsMjEuOTA2MDk3MTk1MDM5MTg3IDc1MCwxOS43MDcwMzIxNDM5MTU0NzcgNzYwLDIyLjY2MjU4NTk3MTYwNzU0OCA3NzAsMjAuNTE2OTI0NjkwODI1NTMgNzgwLDE4LjQxMjEzMjQxNDE5MzM5NCA3OTAsMTYuMjM0MzUzOTk5NjgyMzQgODAwLDE2LjgxODkyNzIzMDI0NjE0IDgwMCwzMCAwLDMwIi8+PGNpcmNsZSBjeD0iMTU3LjkzODAyMTMzMDA1MDMiIGN5PSIxMS42Njc2Nzc5MTg3MzMzNzkiIHI9IjEuMTQ0NTE1ODQwOTQ2MTU2IiBvcGFjaXR5PSIwLjc2MDI3MTQ3MDU3MzYxNTQiLz48Y2lyY2xlIGN4PSI2MjguMzY2MTI5NTAyNzA0NiIgY3k9IjEwLjE3ODA2NjM3MDExNTcxNSIgcj0iMy4yNjY0NjE0NTAxMTEwMTQzIiBvcGFjaXR5PSIwLjY5ODI0MjMyODIyODgxNTMiLz48Y2lyY2xlIGN4PSIyNDUuMDc4NjcwNDg5NTk0ODYiIGN5PSIxMS4yMTMzODUxNjg2Njk2MjMiIHI9IjMuNDM4MzE4OTY5ODEzMDE0IiBvcGFjaXR5PSIwLjMyMDUyNDQ0MTk4NjcwMTA1Ii8+PGNpcmNsZSBjeD0iNjMuNDk3OTAyMzYyMzUzNTYiIGN5PSI4LjUzNjQyMDIxMDAxMDY3NSIgcj0iMS44MTExNzA4MzMwMTk0ODQ0IiBvcGFjaXR5PSIwLjk3NTcwNTYyNzk0NTM5NzciLz48Y2lyY2xlIGN4PSIyNjMuOTQ0NjE2Mjg5ODc3MiIgY3k9IjkuNjI5NDE2MjY5NzQ4MTExIiByPSIxLjg3MDU0NzkxNzc2ODY4NTciIG9wYWNpdHk9IjAuNjExMjQxODc4MzY4NzQyNCIvPjxjaXJjbGUgY3g9IjE3OC4zMzcwOTgxMTU3NTA5NiIgY3k9IjcuMjQwOTc5MDA4NDI3MzY0IiByPSIzLjgyNjAwNjUxMTMyODY1MzciIG9wYWNpdHk9IjAuNDIyODQ2Njc3OTAxOTU1MiIvPjxjaXJjbGUgY3g9IjczNS44MDAwOTU5MjQ5NTA0IiBjeT0iOS40MTA2Mzk2NjM0MDI0NjciIHI9IjEuMTU0OTYyNTExNjk4NjciIG9wYWNpdHk9IjAuMzM5MjI0NDAwMDMzMzE5MzMiLz48Y2lyY2xlIGN4PSIxOS41MDkwMzEzODk4MDc0MiIgY3k9IjkuODA1MTU3NzIxOTU2NjA2IiByPSIyLjk1MjI2MzY2MjEyNzAwNiIgb3BhY2l0eT0iMC4zOTgxNzQzMDkyMjYyNjc2Ii8+PGNpcmNsZSBjeD0iNzI2Ljk2MTU1ODI0Mjk2NTgiIGN5PSI5LjgzMDA1NDg2ODM5Mjc0IiByPSIyLjM2MjE5MjAwMDEyMDQ0MjYiIG9wYWNpdHk9IjAuOTAxNDMwMzg5OTc2Mzg3MSIvPjxjaXJjbGUgY3g9IjkxLjY4NjY5Njc4MTE0NjE4IiBjeT0iMTEuMDYzNTQ5OTU0NTQ1NzQ0IiByPSIyLjUxMDQzNTIzMjc0MzU0OCIgb3BhY2l0eT0iMC41OTQ2OTAwMjU2MzM4OTg1Ii8+PGNpcmNsZSBjeD0iNzA4LjQ4NTEzMDA1OTMxNTYiIGN5PSI3LjQ3MDYxNjk1MTEzMjUzNSIgcj0iMS44NzY2MTUxMzk1NzE1OTY0IiBvcGFjaXR5PSIwLjk1NTMxODg3MDc5Ii8+PGNpcmNsZSBjeD0iMTU1LjU5Nzc0MjE1NzgyNzUiIGN5PSI4LjcwNzM3MTM1NjYyMzI1IiByPSIzLjIwMjg1NDU3MzA0MzA1NTUiIG9wYWNpdHk9IjAuNTE2ODM4NDA2ODg1NTA1Ii8+PGNpcmNsZSBjeD0iNzY0LjM3ODc3NTY2NTk0MzMiIGN5PSIxNC44ODk5NzM3MzI1NDAyNTciIHI9IjIuMDU2MDUwNTM2Njg4OTU3NyIgb3BhY2l0eT0iMC43MTcyNjkzMzQwODgyMjY4Ii8+PGNpcmNsZSBjeD0iMjY0LjUwMjM5MDUyMTE3MzMiIGN5PSI3Ljg3MTI2NDg0MjA0MjUyOSIgcj0iMS40MzU3MjQ1NzUxMzU3MjYyIiBvcGFjaXR5PSIwLjg0MDIzMzEzMDc4NDg1MzYiLz48Y2lyY2xlIGN4PSI0OC4yMjUyMDYwNzAxOTk4OSIgY3k9IjE0LjM4NzEyNjI0MjI4NDk3MyIgcj0iMS42MDE4NzExODAxMDE5NTc4IiBvcGFjaXR5PSIwLjg5ODE4MTI1NjEyNTcwNzQiLz48Y2lyY2xlIGN4PSI3NDEuNDQ3MDY5MDcxNDUxNCIgY3k9IjE0LjkxMjY5OTIxMDc2MTgzOCIgcj0iMy45ODY5ODUxODE5OTkyNjQiIG9wYWNpdHk9IjAuODI2NTQ1NTc2NDY0MDYxIi8+PGNpcmNsZSBjeD0iNjAxLjUwMzE4MDcyNDI4ODgiIGN5PSIxMC43NzE4NDM4ODAyNDM4NTciIHI9IjMuNzI4NjgyMzAyOTM3MTA5MiIgb3BhY2l0eT0iMC40ODc4NzQ1NjQ0MjYzMTEzMyIvPjxjaXJjbGUgY3g9IjU2Mi4yMzEwNzU1ODMzMzI5IiBjeT0iMTAuMzU1MjA0OTMxODkzNzU2IiByPSIzLjQ5NzM3MjI0NzEzNTkxOSIgb3BhY2l0eT0iMC43OTQ3MjExNzg2MjQ2MjUxIi8+PGNpcmNsZSBjeD0iNzYuNTUwNjI0MzQ3NzcyNTMiIGN5PSIxMi40ODA5NDA5MDc1ODAzOTUiIHI9IjIuNjA4OTU4NTQ3OTY2NDA5NSIgb3BhY2l0eT0iMC43OTQwMjE3ODAwNzg2OTUxIi8+PGNpcmNsZSBjeD0iNjkuMDk0NTc4OTE1NDUwMSIgY3k9IjguNjgwMzM2NDU5MDg1ODE5IiByPSIxLjQ5MjU5NTMzMjg2ODUxOTgiIG9wYWNpdHk9IjAuMzg4ODc1ODkzNTYwOTI2NCIvPjxjaXJjbGUgY3g9IjYxNC4xMzQwMDY5Njc1MDgxIiBjeT0iMTEuMjM0MjE5NjQ5ODg1MzcyIiByPSIyLjg0OTQwMTYzMjUxNDgyNTciIG9wYWNpdHk9IjAuOTI5MDI3NjU1NjE5Nzc1MiIvPjxjaXJjbGUgY3g9IjE4MS4xNDM4ODA3MDA4MzA1NSIgY3k9IjExLjU3MzYxODAxNTc2NjAwOSIgcj0iMi4yNDk2NzgzNjY1MDcyNTYiIG9wYWNpdHk9IjAuNzEwMTQyMTc1OTI3NDM3MiIvPjxjaXJjbGUgY3g9IjY5NS44Mjk0OTk1MDAwNDQ3IiBjeT0iOS41MjA0NzI1NTMyMjMyIiByPSIxLjczODg4NjIwMjg1MTQwNzYiIG9wYWNpdHk9IjAuOTk5NjE4MjkwNzMwMDU3Ii8+PGNpcmNsZSBjeD0iNTg5LjEwMTQ1NjIyNTI0NDYiIGN5PSIxMy41MTIzOTg3MjQ5NTIzNTkiIHI9IjIuNDI4NzM2OTY0OTU0OTY3MyIgb3BhY2l0eT0iMC43MzE2OTk4MjA2NjE5NTU3Ii8+PGNpcmNsZSBjeD0iMjUyLjAyNzY3NDI3MjA2ODQiIGN5PSI2LjUzODI4NDkxNTI5MTcxNCIgcj0iMS45NjM1OTA0MzY2MDczOTk1IiBvcGFjaXR5PSIwLjk4NzQ5NjU4OTI4NTk2NDQiLz48Y2lyY2xlIGN4PSI3NDcuMzM3NjUzNjUyNTU4MSIgY3k9IjEzLjgyNTY1NzMxOTUyNzY5MyIgcj0iMy42Mzc4ODYwMjQ3Njc2MzYzIiBvcGFjaXR5PSIwLjk4MTk3NTk3MDU3MjA2MTkiLz48Y2lyY2xlIGN4PSI3MTYuMjg3NzA3MjY5MjI0NCIgY3k9IjguMzI4Nzk0NTgyODAwNTA5IiByPSIyLjM1MDk1MjQyMTI1MDU4ODYiIG9wYWNpdHk9IjAuOTY4NzE4NTYxNzQzNjIzNCIvPjxjaXJjbGUgY3g9IjQwLjU4MzI4MDkzMzA2NTYiIGN5PSI5Ljk5ODk0OTIwNTIzMDcyMyIgcj0iMi4xMjEwMzE4MjM1ODAxMzY0IiBvcGFjaXR5PSIwLjgzNzUzMjc0MzQ1OTQyOCIvPjxjaXJjbGUgY3g9IjY0MC42Nzc2Mzk2NTY0MjA1IiBjeT0iOC41MTg4Njc4ODE1ODE1NjciIHI9IjEuOTAyNjQwMTcwNTQ0NTQ0NiIgb3BhY2l0eT0iMC41OTA2MTQ4MzY1NDYwNTg4Ii8+PGNpcmNsZSBjeD0iNTkxLjI1MjA5ODQxNDQzOTQiIGN5PSI3LjUxNDkxNDk3Nzg1MDQ5OCIgcj0iMi40MDMzNjU5MjQ4MjE4OTIiIG9wYWNpdHk9IjAuNzExMTY3MDkwMjkyOTgzNiIvPjxjaXJjbGUgY3g9IjQwNC4xNDQ5OTA3NDM0MjEyIiBjeT0iNS45Nzk2OTMwMDE2MDI0NTgiIHI9IjIuNjcyODU4NzQ2NTMwMDcxMyIgb3BhY2l0eT0iMC42NTEwMTAwNDQxNDE5NjMiLz48Y2lyY2xlIGN4PSI0NTUuNzYwOTE5NzgxOTE2NDciIGN5PSIxNC40NDcxNDY1MDY2MDI2MDciIHI9IjIuNzgwMTQzNDg4MDcyMjY2IiBvcGFjaXR5PSIwLjk5MzkzMjY1NTYzMDczNTUiLz48Y2lyY2xlIGN4PSI1NDIuMzM0NDQwMjI4NDQ2OSIgY3k9IjkuNzk1NDc4NzgwNDQxOTMiIHI9IjMuMDMwNzY1NzAzOTA2Njc5MyIgb3BhY2l0eT0iMC43Mjc2MDU5Mzk4MTMxNDU4Ii8+PGNpcmNsZSBjeD0iNjc4LjE4MzkyODIwMTUxNDIiIGN5PSIxMC45NDU5OTU4ODQ1OTMyMDciIHI9IjMuNzEwMDQyNzA5MTc4Njk5NCIgb3BhY2l0eT0iMC40NDg5Njc1NTIxNTQ1NjcyIi8+PGNpcmNsZSBjeD0iNjg0LjM1ODUwNTgxOTkyODYiIGN5PSIxMC41NjYwODI0NjE2MjcxMTkiIHI9IjMuMjA0MzQwMTg2ODA5OTE2IiBvcGFjaXR5PSIwLjQyNjgxNDA3NjUwMDU2OTIiLz48Y2lyY2xlIGN4PSI0MTYuMzYzMDU3MjIzNTM3MzQiIGN5PSI4LjMzMjIxNDM0NjQ3MjU5NyIgcj0iMi40NTAzODAwODgzNTcxMzYiIG9wYWNpdHk9IjAuMzM0NTgzOTk2OTQ0NTcxOSIvPjxjaXJjbGUgY3g9IjUwLjY4NTUzOTU5OTcyODczIiBjeT0iNi4xOTg0OTMyNTI1MTQ4NDgiIHI9IjIuMzQ1NDgxMzMwOTExNTU2NyIgb3BhY2l0eT0iMC45ODE5MDgwOTU4MDM0OTI5Ii8+PGNpcmNsZSBjeD0iNDgzLjc3MjY2NTgxNjI3NTU1IiBjeT0iOS4xMjQ0MDU0MzE2NjY4ODEiIHI9IjEuNDI4MTk0OTQzNTYxMjU1MyIgb3BhY2l0eT0iMC45NTU0MDMzMjEzNjYyNTcyIi8+PGNpcmNsZSBjeD0iMzkxLjAwNzY4MTk5MDY0MTQ2IiBjeT0iMTEuNTc4MjQ5MDEyOTc1MjQiIHI9IjEuMjgwODQxODYwNzY5NTU2NCIgb3BhY2l0eT0iMC45MTE0MjUwNzM0NTkwMTM1Ii8+PGNpcmNsZSBjeD0iMjA4LjgwMzEzMzE5NjU0NzEiIGN5PSI1LjcxMzY3NDQ5NjIwMjQzNiIgcj0iMy43MjE3Mzc4ODE0MjQzMjkiIG9wYWNpdHk9IjAuNTM2ODY2MjkyMDA3NDgxNCIvPjwvc3ZnPg=='); -webkit-mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; z-index: 20; pointer-events: none; }
      </style>
      <!-- Hero -->
      <section style="position: relative; height: 80vh; min-height: 600px; display: flex; align-items: center; justify-content: center; color: white; text-align: center; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=80" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />
        <div style="position: absolute; inset: 0; background-color: rgba(0,0,0,0.3); z-index: 1; pointer-events: none;"></div>
        <div class="cj-edge-beach" style="z-index: 2;"></div>
        <div style="position: relative; z-index: 10; max-width: 800px; padding: 20px;">
          <div style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px;">Việt Nam • Biển Đảo</div>
          <h1 class="cj-heading" style="font-size: 4.5rem; font-weight: 700; margin-bottom: 20px; line-height: 1.1; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">Thiên Đường Biển Xanh</h1>
          <p style="font-size: 1.15rem; margin-bottom: 40px; font-weight: 300; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.9;">Đắm mình trong làn nước trong vắt, dạo bước trên bãi cát trắng mịn màng và tìm lại sự bình yên nơi đại dương.</p>
          <a href="#main-content" style="display: inline-flex; align-items: center; padding: 14px 36px; background-color: white; color: #111; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s;">
            Khám phá ngay <span style="margin-left: 8px;">→</span>
          </a>
        </div>
      </section>

      <!-- Nội dung chính -->
      <section id="main-content" style="padding: 120px 20px; background-color: #fafafa;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 class="cj-heading" style="font-size: 3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 30px;">Chào mừng đến với đại dương kỳ thú</h2>
          <div style="width: 60px; height: 2px; background-color: #d1d5db; margin: 0 auto 30px auto;"></div>
          <p style="color: #4b5563; line-height: 1.8; font-size: 1.125rem; font-weight: 300;">Nơi lý tưởng để bạn gác lại mọi âu lo, tận hưởng tiếng sóng vỗ rì rào và những cơn gió biển mát lành. Bãi biển trải dài với cát trắng mịn, nước trong vắt đến tận đáy, cùng hệ sinh thái rạn san hô đa dạng sẽ mang lại cho bạn một kỳ nghỉ không thể nào quên.</p>
        </div>
      </section>

      <!-- Grid nổi bật -->
      <style>
        @media (min-width: 768px) { .cj-stagger-down { transform: translateY(60px); } }
      </style>
      <section style="padding: 40px 20px 140px 20px; background-color: #fafafa;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; padding-top: 20px;">
          <div style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Bãi Cát Trắng</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Khám phá những dải cát trắng mịn màng uốn lượn quanh bờ biển xanh ngắt.</p>
            </div>
          </div>
          <div class="cj-stagger-down" style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Hoàng Hôn</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Khoảnh khắc mặt trời lặn nhuộm vàng cả một vùng trời vĩ đại.</p>
            </div>
          </div>
          <div style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Nghỉ Dưỡng</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Khu nghỉ dưỡng tiện nghi, mang lại trải nghiệm xa hoa và yên tĩnh.</p>
            </div>
          </div>
          <div class="cj-stagger-down" style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">San Hô</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Chiêm ngưỡng hệ sinh thái dưới nước phong phú và đầy sắc màu.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Nội dung phụ -->
      <section style="padding: 80px 20px 120px 20px; background-color: #fff;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 80px;">
          <div style="flex: 1; min-width: 300px; position: relative;">
            <div style="position: absolute; top: 30px; left: -30px; bottom: -30px; right: 30px; background-color: #f3f4f6; z-index: 0;"></div>
            <img src="https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?auto=format&fit=crop&w=800&q=80" alt="Biển" style="width: 100%; position: relative; z-index: 1; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
          </div>
          <div style="flex: 1; min-width: 300px; padding: 20px;">
            <div style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; font-weight: 600; color: #6b7280; margin-bottom: 15px;">Trải Nghiệm Nổi Bật</div>
            <h3 class="cj-heading" style="font-size: 2.5rem; font-weight: 600; color: #1a1a1a; margin-bottom: 30px;">Bản giao hưởng của đại dương</h3>
            <p style="color: #4b5563; line-height: 1.8; font-size: 1.05rem; font-weight: 300; margin-bottom: 30px;">Tham gia vào những hoạt động không thể bỏ lỡ khi đặt chân đến thiên đường biển xanh này.</p>
            <ul style="list-style: none; padding: 0; margin: 0; color: #1a1a1a; font-size: 1.05rem; line-height: 2.5; font-weight: 400;">
              <li style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 10px;"><strong>Lặn ngắm san hô:</strong> Khám phá thế giới dưới đại dương.</li>
              <li style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 10px;"><strong>Hải sản tươi sống:</strong> Thưởng thức các món ngon địa phương.</li>
              <li style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 10px;"><strong>Ngắm hoàng hôn:</strong> Bắt trọn khoảnh khắc lãng mạn.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Album ảnh -->
      <section style="padding: 100px 20px; background-color: #fafafa; text-align: center;">
        <h2 class="cj-heading" style="font-size: 2.5rem; font-weight: 600; color: #1a1a1a; margin-bottom: 20px;">Thư Viện Ảnh</h2>
        <p style="color: #6b7280; margin-bottom: 50px; font-weight: 300;">Cùng nhìn ngắm những khoảnh khắc đẹp nhất</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; max-width: 1200px; margin: 0 auto;">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"/>
          <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"/>
          <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"/>
          <img src="https://images.unsplash.com/photo-1520483601560-389dff434fdf?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"/>
        </div>
      </section>
    </div>
  `,
  mountain: `
    <div style="font-family: 'Inter', sans-serif; color: #333; background-color: #fafafa;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600&display=swap');
        .cj-heading { font-family: 'Playfair Display', serif; }
        .cj-edge-mountain { position: absolute; bottom: -1px; left: 0; right: 0; height: 35px; background-color: #fafafa; -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgMzAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCwxOC4zODQ2MjQ5OTI5MDYzNzUgMTAsMTYuOTk5MTM2ODM2NDQ2NzYgMjAsMTUuMTQwMjM2MjI3OTMwMzQzIDMwLDE4LjIxODA1NjA3MzM4OTU2MiA0MCwyMi4wMjY2NTE4NjgwODU3OCA1MCwxOC41NTM4OTMwNTc5OTY2NDYgNjAsMTYuOTczNzI1MDE0NTM1NDQgNzAsMTUuMTQxNDA1MzgxNjExNTEzIDgwLDE5Ljc1MTUxNjk1MTc1NDk0NCA5MCwxOS4xNTgxMTczODkzNzk4NCAxMDAsMjEuMzI2MDQxMDcwNDc4OTY1IDExMCwxOS43NDc1Njg5MzcyMTYwODQgMTIwLDIyLjg1MjcxOTkyODMwNzkwMiAxMzAsMTkuMDc0NTQ1Nzk2MTQ1MDc4IDE0MCwxOC4xNjI4MDI4MDA5NzY1ODYgMTUwLDE4LjQ4OTQ4NzIwNDY3OTg2IDE2MCwxNS4zMDA4MDk4NzIyODUyMTIgMTcwLDE1LjYyMDY3MTcxMTI0MjA5NCAxODAsMjIuNTAwNTg2NDI5NTAxMTQgMTkwLDIxLjkyNjYzODgzNjAyOTMgMjAwLDE4LjYyNjc4OTQyNzA5MjYwNCAyMTAsMTcuOTMwMTM1NjgzNzcyMzg4IDIyMCwxNS4xNzEyNTUyNzgyODQ0MyAyMzAsMjIuNDkzOTc2MzIyODE0NjkgMjQwLDIxLjA2NjgzNzQ2MjAxMDMxMiAyNTAsMTYuMzg5NTAxNTc3NjUwMDk0IDI2MCwxNS44NDEwNTk2NDI3OTY5ODMgMjcwLDIyLjE1ODIzNzI5MTcyMzk5MiAyODAsMjIuNzM3Mjc2MTA4Njc0MDg4IDI5MCwxNy4xNDExMDQwNjQ5NDU4MyAzMDAsMjIuNDAyMDg5NDc1NzkzODggMzEwLDE1LjQzOTM3MDc3NDkxMTQ0IDMyMCwyMS4zMDAwNjMyOTQ0ODcxNzggMzMwLDIxLjMwOTM1NzY5Njk2MTE3IDM0MCwyMS45Mzg5MDM2ODM2Njc2MDQgMzUwLDE4LjkwNDMzNDQ2NzMzMzI2OCAzNjAsMjIuMTk3NTMyOTA5NTkyMTg0IDM3MCwyMi40NTI4Mjc4ODkwMDEzNDggMzgwLDE1Ljg1NDU3OTA0NDM3NjAzMyAzOTAsMTUuMTg2NjY3Mzg1OTI1MDE4IDQwMCwyMC45OTk1MzgwNjkwOTA5MiA0MTAsMjIuNjcyOTM1NzgyMjAzNjQgNDIwLDE1Ljk0NTIzMTc1MTcxMjc3OSA0MzAsMjAuODgyNzIxMjczMzU2OTUgNDQwLDIwLjU3OTQzODI3MTE1NDA2IDQ1MCwyMi44MzUwNzgxOTQ5MzI5OCA0NjAsMjAuNzUwMzY4MDU5Mzk1NDQ1IDQ3MCwyMC44ODU5MzAwNTcxODM4NTYgNDgwLDE2LjQ1ODUxOTE0MTk4NjAzIDQ5MCwyMC41NzQ3ODYzMDc1NDI1MDMgNTAwLDE2Ljc3Mjk3NDYyNjkzMTMzMyA1MTAsMTcuODgyNTMxMDEyOTUyNzU0IDUyMCwxNS41MTY4MzM3Mzc2MTM1NDQgNTMwLDE1Ljc5OTc0MjA2MjE1NDg4OCA1NDAsMTYuODgxMzkyNjc3MDA1Mzg3IDU1MCwxOS42NDg3OTY3NDIzNDE4ODcgNTYwLDE2LjAxMjE2OTM5MzA4OTI4IDU3MCwxNy4wNzE1ODU2MjEzODYwMDYgNTgwLDE5LjU5NjU0NDIxMDc4NTI5IDU5MCwyMi4wMDIzMzU3MzIxMDA4OTYgNjAwLDE4LjY3OTExOTEzNTIzMzEzMyA2MTAsMjIuOTAwMjE4NDAyNTk3OTY4IDYyMCwyMC4wMDYzNTE2MjQ2Mzc0MzIgNjMwLDE2LjQ1MTgyODQyOTcwNTU0IDY0MCwxOS40MjgwMDEwOTc5MDQ3MjMgNjUwLDE3LjI5MzY0NTQ4NDM1MjggNjYwLDE4LjgwOTg4OTU0NDY5NDQxIDY3MCwxOC43NzkxNTg4NjE4Njg0MSA2ODAsMTguNTgxMzk3NDg3Mjk1MjI0IDY5MCwyMi40MDM0NzU2NjY4NDUyNiA3MDAsMTcuMzY4NTg5MjQzNzQ2MDcyIDcxMCwyMS41NDA5NjQ1Njc3NzE0ODIgNzIwLDIwLjkwNDA5NTc5MjgzNjkgNzMwLDIwLjE3NzIzMzQ4NzUxNDg0NCA3NDAsMjEuOTA2MDk3MTk1MDM5MTg3IDc1MCwxOS43MDcwMzIxNDM5MTU0NzcgNzYwLDIyLjY2MjU4NTk3MTYwNzU0OCA3NzAsMjAuNTE2OTI0NjkwODI1NTMgNzgwLDE4LjQxMjEzMjQxNDE5MzM5NCA3OTAsMTYuMjM0MzUzOTk5NjgyMzQgODAwLDE2LjgxODkyNzIzMDI0NjE0IDgwMCwzMCAwLDMwIi8+PGNpcmNsZSBjeD0iMTU3LjkzODAyMTMzMDA1MDMiIGN5PSIxMS42Njc2Nzc5MTg3MzMzNzkiIHI9IjEuMTQ0NTE1ODQwOTQ2MTU2IiBvcGFjaXR5PSIwLjc2MDI3MTQ3MDU3MzYxNTQiLz48Y2lyY2xlIGN4PSI2MjguMzY2MTI5NTAyNzA0NiIgY3k9IjEwLjE3ODA2NjM3MDExNTcxNSIgcj0iMy4yNjY0NjE0NTAxMTEwMTQzIiBvcGFjaXR5PSIwLjY5ODI0MjMyODIyODgxNTMiLz48Y2lyY2xlIGN4PSIyNDUuMDc4NjcwNDg5NTk0ODYiIGN5PSIxMS4yMTMzODUxNjg2Njk2MjMiIHI9IjMuNDM4MzE4OTY5ODEzMDE0IiBvcGFjaXR5PSIwLjMyMDUyNDQ0MTk4NjcwMTA1Ii8+PGNpcmNsZSBjeD0iNjMuNDk3OTAyMzYyMzUzNTYiIGN5PSI4LjUzNjQyMDIxMDAxMDY3NSIgcj0iMS44MTExNzA4MzMwMTk0ODQ0IiBvcGFjaXR5PSIwLjk3NTcwNTYyNzk0NTM5NzciLz48Y2lyY2xlIGN4PSIyNjMuOTQ0NjE2Mjg5ODc3MiIgY3k9IjkuNjI5NDE2MjY5NzQ4MTExIiByPSIxLjg3MDU0NzkxNzc2ODY4NTciIG9wYWNpdHk9IjAuNjExMjQxODc4MzY4NzQyNCIvPjxjaXJjbGUgY3g9IjE3OC4zMzcwOTgxMTU3NTA5NiIgY3k9IjcuMjQwOTc5MDA4NDI3MzY0IiByPSIzLjgyNjAwNjUxMTMyODY1MzciIG9wYWNpdHk9IjAuNDIyODQ2Njc3OTAxOTU1MiIvPjxjaXJjbGUgY3g9IjczNS44MDAwOTU5MjQ5NTA0IiBjeT0iOS40MTA2Mzk2NjM0MDI0NjciIHI9IjEuMTU0OTYyNTExNjk4NjciIG9wYWNpdHk9IjAuMzM5MjI0NDAwMDMzMzE5MzMiLz48Y2lyY2xlIGN4PSIxOS41MDkwMzEzODk4MDc0MiIgY3k9IjkuODA1MTU3NzIxOTU2NjA2IiByPSIyLjk1MjI2MzY2MjEyNzAwNiIgb3BhY2l0eT0iMC4zOTgxNzQzMDkyMjYyNjc2Ii8+PGNpcmNsZSBjeD0iNzI2Ljk2MTU1ODI0Mjk2NTgiIGN5PSI5LjgzMDA1NDg2ODM5Mjc0IiByPSIyLjM2MjE5MjAwMDEyMDQ0MjYiIG9wYWNpdHk9IjAuOTAxNDMwMzg5OTc2Mzg3MSIvPjxjaXJjbGUgY3g9IjkxLjY4NjY5Njc4MTE0NjE4IiBjeT0iMTEuMDYzNTQ5OTU0NTQ1NzQ0IiByPSIyLjUxMDQzNTIzMjc0MzU0OCIgb3BhY2l0eT0iMC41OTQ2OTAwMjU2MzM4OTg1Ii8+PGNpcmNsZSBjeD0iNzA4LjQ4NTEzMDA1OTMxNTYiIGN5PSI3LjQ3MDYxNjk1MTEzMjUzNSIgcj0iMS44NzY2MTUxMzk1NzE1OTY0IiBvcGFjaXR5PSIwLjk1NTMxODg3MDc5Ii8+PGNpcmNsZSBjeD0iMTU1LjU5Nzc0MjE1NzgyNzUiIGN5PSI4LjcwNzM3MTM1NjYyMzI1IiByPSIzLjIwMjg1NDU3MzA0MzA1NTUiIG9wYWNpdHk9IjAuNTE2ODM4NDA2ODg1NTA1Ii8+PGNpcmNsZSBjeD0iNzY0LjM3ODc3NTY2NTk0MzMiIGN5PSIxNC44ODk5NzM3MzI1NDAyNTciIHI9IjIuMDU2MDUwNTM2Njg4OTU3NyIgb3BhY2l0eT0iMC43MTcyNjkzMzQwODgyMjY4Ii8+PGNpcmNsZSBjeD0iMjY0LjUwMjM5MDUyMTE3MzMiIGN5PSI3Ljg3MTI2NDg0MjA0MjUyOSIgcj0iMS40MzU3MjQ1NzUxMzU3MjYyIiBvcGFjaXR5PSIwLjg0MDIzMzEzMDc4NDg1MzYiLz48Y2lyY2xlIGN4PSI0OC4yMjUyMDYwNzAxOTk4OSIgY3k9IjE0LjM4NzEyNjI0MjI4NDk3MyIgcj0iMS42MDE4NzExODAxMDE5NTc4IiBvcGFjaXR5PSIwLjg5ODE4MTI1NjEyNTcwNzQiLz48Y2lyY2xlIGN4PSI3NDEuNDQ3MDY5MDcxNDUxNCIgY3k9IjE0LjkxMjY5OTIxMDc2MTgzOCIgcj0iMy45ODY5ODUxODE5OTkyNjQiIG9wYWNpdHk9IjAuODI2NTQ1NTc2NDY0MDYxIi8+PGNpcmNsZSBjeD0iNjAxLjUwMzE4MDcyNDI4ODgiIGN5PSIxMC43NzE4NDM4ODAyNDM4NTciIHI9IjMuNzI4NjgyMzAyOTM3MTA5MiIgb3BhY2l0eT0iMC40ODc4NzQ1NjQ0MjYzMTEzMyIvPjxjaXJjbGUgY3g9IjU2Mi4yMzEwNzU1ODMzMzI5IiBjeT0iMTAuMzU1MjA0OTMxODkzNzU2IiByPSIzLjQ5NzM3MjI0NzEzNTkxOSIgb3BhY2l0eT0iMC43OTQ3MjExNzg2MjQ2MjUxIi8+PGNpcmNsZSBjeD0iNzYuNTUwNjI0MzQ3NzcyNTMiIGN5PSIxMi40ODA5NDA5MDc1ODAzOTUiIHI9IjIuNjA4OTU4NTQ3OTY2NDA5NSIgb3BhY2l0eT0iMC43OTQwMjE3ODAwNzg2OTUxIi8+PGNpcmNsZSBjeD0iNjkuMDk0NTc4OTE1NDUwMSIgY3k9IjguNjgwMzM2NDU5MDg1ODE5IiByPSIxLjQ5MjU5NTMzMjg2ODUxOTgiIG9wYWNpdHk9IjAuMzg4ODc1ODkzNTYwOTI2NCIvPjxjaXJjbGUgY3g9IjYxNC4xMzQwMDY5Njc1MDgxIiBjeT0iMTEuMjM0MjE5NjQ5ODg1MzcyIiByPSIyLjg0OTQwMTYzMjUxNDgyNTciIG9wYWNpdHk9IjAuOTI5MDI3NjU1NjE5Nzc1MiIvPjxjaXJjbGUgY3g9IjE4MS4xNDM4ODA3MDA4MzA1NSIgY3k9IjExLjU3MzYxODAxNTc2NjAwOSIgcj0iMi4yNDk2NzgzNjY1MDcyNTYiIG9wYWNpdHk9IjAuNzEwMTQyMTc1OTI3NDM3MiIvPjxjaXJjbGUgY3g9IjY5NS44Mjk0OTk1MDAwNDQ3IiBjeT0iOS41MjA0NzI1NTMyMjMyIiByPSIxLjczODg4NjIwMjg1MTQwNzYiIG9wYWNpdHk9IjAuOTk5NjE4MjkwNzMwMDU3Ii8+PGNpcmNsZSBjeD0iNTg5LjEwMTQ1NjIyNTI0NDYiIGN5PSIxMy41MTIzOTg3MjQ5NTIzNTkiIHI9IjIuNDI4NzM2OTY0OTU0OTY3MyIgb3BhY2l0eT0iMC43MzE2OTk4MjA2NjE5NTU3Ii8+PGNpcmNsZSBjeD0iMjUyLjAyNzY3NDI3MjA2ODQiIGN5PSI2LjUzODI4NDkxNTI5MTcxNCIgcj0iMS45NjM1OTA0MzY2MDczOTk1IiBvcGFjaXR5PSIwLjk4NzQ5NjU4OTI4NTk2NDQiLz48Y2lyY2xlIGN4PSI3NDcuMzM3NjUzNjUyNTU4MSIgY3k9IjEzLjgyNTY1NzMxOTUyNzY5MyIgcj0iMy42Mzc4ODYwMjQ3Njc2MzYzIiBvcGFjaXR5PSIwLjk4MTk3NTk3MDU3MjA2MTkiLz48Y2lyY2xlIGN4PSI3MTYuMjg3NzA3MjY5MjI0NCIgY3k9IjguMzI4Nzk0NTgyODAwNTA5IiByPSIyLjM1MDk1MjQyMTI1MDU4ODYiIG9wYWNpdHk9IjAuOTY4NzE4NTYxNzQzNjIzNCIvPjxjaXJjbGUgY3g9IjQwLjU4MzI4MDkzMzA2NTYiIGN5PSI5Ljk5ODk0OTIwNTIzMDcyMyIgcj0iMi4xMjEwMzE4MjM1ODAxMzY0IiBvcGFjaXR5PSIwLjgzNzUzMjc0MzQ1OTQyOCIvPjxjaXJjbGUgY3g9IjY0MC42Nzc2Mzk2NTY0MjA1IiBjeT0iOC41MTg4Njc4ODE1ODE1NjciIHI9IjEuOTAyNjQwMTcwNTQ0NTQ0NiIgb3BhY2l0eT0iMC41OTA2MTQ4MzY1NDYwNTg4Ii8+PGNpcmNsZSBjeD0iNTkxLjI1MjA5ODQxNDQzOTQiIGN5PSI3LjUxNDkxNDk3Nzg1MDQ5OCIgcj0iMi40MDMzNjU5MjQ4MjE4OTIiIG9wYWNpdHk9IjAuNzExMTY3MDkwMjkyOTgzNiIvPjxjaXJjbGUgY3g9IjQwNC4xNDQ5OTA3NDM0MjEyIiBjeT0iNS45Nzk2OTMwMDE2MDI0NTgiIHI9IjIuNjcyODU4NzQ2NTMwMDcxMyIgb3BhY2l0eT0iMC42NTEwMTAwNDQxNDE5NjMiLz48Y2lyY2xlIGN4PSI0NTUuNzYwOTE5NzgxOTE2NDciIGN5PSIxNC40NDcxNDY1MDY2MDI2MDciIHI9IjIuNzgwMTQzNDg4MDcyMjY2IiBvcGFjaXR5PSIwLjk5MzkzMjY1NTYzMDczNTUiLz48Y2lyY2xlIGN4PSI1NDIuMzM0NDQwMjI4NDQ2OSIgY3k9IjkuNzk1NDc4NzgwNDQxOTMiIHI9IjMuMDMwNzY1NzAzOTA2Njc5MyIgb3BhY2l0eT0iMC43Mjc2MDU5Mzk4MTMxNDU4Ii8+PGNpcmNsZSBjeD0iNjc4LjE4MzkyODIwMTUxNDIiIGN5PSIxMC45NDU5OTU4ODQ1OTMyMDciIHI9IjMuNzEwMDQyNzA5MTc4Njk5NCIgb3BhY2l0eT0iMC40NDg5Njc1NTIxNTQ1NjcyIi8+PGNpcmNsZSBjeD0iNjg0LjM1ODUwNTgxOTkyODYiIGN5PSIxMC41NjYwODI0NjE2MjcxMTkiIHI9IjMuMjA0MzQwMTg2ODA5OTE2IiBvcGFjaXR5PSIwLjQyNjgxNDA3NjUwMDU2OTIiLz48Y2lyY2xlIGN4PSI0MTYuMzYzMDU3MjIzNTM3MzQiIGN5PSI4LjMzMjIxNDM0NjQ3MjU5NyIgcj0iMi40NTAzODAwODgzNTcxMzYiIG9wYWNpdHk9IjAuMzM0NTgzOTk2OTQ0NTcxOSIvPjxjaXJjbGUgY3g9IjUwLjY4NTUzOTU5OTcyODczIiBjeT0iNi4xOTg0OTMyNTI1MTQ4NDgiIHI9IjIuMzQ1NDgxMzMwOTExNTU2NyIgb3BhY2l0eT0iMC45ODE5MDgwOTU4MDM0OTI5Ii8+PGNpcmNsZSBjeD0iNDgzLjc3MjY2NTgxNjI3NTU1IiBjeT0iOS4xMjQ0MDU0MzE2NjY4ODEiIHI9IjEuNDI4MTk0OTQzNTYxMjU1MyIgb3BhY2l0eT0iMC45NTU0MDMzMjEzNjYyNTcyIi8+PGNpcmNsZSBjeD0iMzkxLjAwNzY4MTk5MDY0MTQ2IiBjeT0iMTEuNTc4MjQ5MDEyOTc1MjQiIHI9IjEuMjgwODQxODYwNzY5NTU2NCIgb3BhY2l0eT0iMC45MTE0MjUwNzM0NTkwMTM1Ii8+PGNpcmNsZSBjeD0iMjA4LjgwMzEzMzE5NjU0NzEiIGN5PSI1LjcxMzY3NDQ5NjIwMjQzNiIgcj0iMy43MjE3Mzc4ODE0MjQzMjkiIG9wYWNpdHk9IjAuNTM2ODY2MjkyMDA3NDgxNCIvPjwvc3ZnPg=='); -webkit-mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; z-index: 20; pointer-events: none; }
      </style>
      <!-- Hero -->
      <section style="position: relative; height: 80vh; min-height: 600px; display: flex; align-items: center; justify-content: center; color: white; text-align: center; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />
        <div style="position: absolute; inset: 0; background-color: rgba(20, 30, 20, 0.4); z-index: 1; pointer-events: none;"></div>
        <div class="cj-edge-mountain" style="z-index: 2;"></div>
        <div style="position: relative; z-index: 10; max-width: 800px; padding: 20px;">
          <div style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; color: #e5e7eb;">Tây Bắc • Núi Rừng</div>
          <h1 class="cj-heading" style="font-size: 4.5rem; font-weight: 700; margin-bottom: 20px; line-height: 1.1; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">Hùng Vĩ Đại Ngàn</h1>
          <p style="font-size: 1.15rem; margin-bottom: 40px; font-weight: 300; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.9;">Chinh phục những đỉnh cao, hòa mình vào khung cảnh sương mù mờ ảo và thở cùng hơi thở của rừng.</p>
          <a href="#main-content" style="display: inline-flex; align-items: center; padding: 14px 36px; background-color: white; color: #111; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s;">
            Bắt đầu hành trình <span style="margin-left: 8px;">→</span>
          </a>
        </div>
      </section>
      
      <!-- Nội dung chính -->
      <section id="main-content" style="padding: 120px 20px; background-color: #fafafa;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 class="cj-heading" style="font-size: 3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 30px;">Tìm lại sự bình yên</h2>
          <div style="width: 60px; height: 2px; background-color: #4b5563; margin: 0 auto 30px auto;"></div>
          <p style="color: #4b5563; line-height: 1.8; font-size: 1.125rem; font-weight: 300;">Rời xa khói bụi thành phố, đến với núi rừng nguyên sơ, nơi bạn có thể tìm lại sự bình yên trong tâm hồn. Cảnh quan thiên nhiên hoang sơ, không khí trong lành, cùng những cung đường uốn lượn bên sườn đồi sẽ làm say đắm bất kỳ ai yêu thích sự phiêu lưu.</p>
        </div>
      </section>

      <!-- Grid nổi bật -->
      <style>
        @media (min-width: 768px) { .cj-stagger-down { transform: translateY(60px); } }
      </style>
      <section style="padding: 40px 20px 140px 20px; background-color: #fafafa;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; padding-top: 20px;">
          <div style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Đỉnh Cao</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Chinh phục những ngọn núi hùng vĩ vươn mình giữa biển mây.</p>
            </div>
          </div>
          <div class="cj-stagger-down" style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Bản Làng</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Khám phá nét đẹp văn hóa bình dị của đồng bào vùng cao.</p>
            </div>
          </div>
          <div style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Suối Nước</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Lắng nghe tiếng suối chảy róc rách giữa rừng già nguyên sinh.</p>
            </div>
          </div>
          <div class="cj-stagger-down" style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 10px;">Biển Mây</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Đón ánh bình minh trên cao và thưởng thức biển mây tuyệt đẹp.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Nội dung phụ -->
      <section style="padding: 80px 20px 120px 20px; background-color: #fff;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 80px; flex-direction: row-reverse;">
          <div style="flex: 1; min-width: 300px; position: relative;">
            <div style="position: absolute; top: 30px; left: 30px; bottom: -30px; right: -30px; background-color: #f3f4f6; z-index: 0;"></div>
            <img src="https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80" alt="Rừng núi" style="width: 100%; position: relative; z-index: 1; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
          </div>
          <div style="flex: 1; min-width: 300px; padding: 20px;">
            <div style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; font-weight: 600; color: #6b7280; margin-bottom: 15px;">Hoạt Động Khám Phá</div>
            <h3 class="cj-heading" style="font-size: 2.5rem; font-weight: 600; color: #1a1a1a; margin-bottom: 30px;">Những dấu chân phiêu lưu</h3>
            <p style="color: #4b5563; line-height: 1.8; font-size: 1.05rem; font-weight: 300; margin-bottom: 30px;">Chuẩn bị ba lô và sẵn sàng cho những trải nghiệm tuyệt vời cùng thiên nhiên hoang dã.</p>
            <ul style="list-style: none; padding: 0; margin: 0; color: #1a1a1a; font-size: 1.05rem; line-height: 2.5; font-weight: 400;">
              <li style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 10px;"><strong>Trekking đỉnh cao:</strong> Băng qua những khu rừng nguyên sinh dầy đặc.</li>
              <li style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 10px;"><strong>Cắm trại qua đêm:</strong> Đốt lửa trại và ngắm bầu trời đầy sao.</li>
              <li style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 10px;"><strong>Săn biển mây:</strong> Đón ánh bình minh lộng lẫy trên đỉnh núi.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Album ảnh -->
      <section style="padding: 100px 20px; background-color: #fafafa; text-align: center;">
        <h2 class="cj-heading" style="font-size: 2.5rem; font-weight: 600; color: #1a1a1a; margin-bottom: 20px;">Khoảnh Khắc Đáng Nhớ</h2>
        <p style="color: #6b7280; margin-bottom: 50px; font-weight: 300;">Vẻ đẹp hoang sơ của tạo hóa</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; max-width: 1200px; margin: 0 auto;">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
          <img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
          <img src="https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
          <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
        </div>
      </section>
    </div>
  `,
  heritage: `
    <div style="font-family: 'Inter', sans-serif; color: #333; background-color: #fdfbf7;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600&display=swap');
        .cj-heading { font-family: 'Playfair Display', serif; }
        .cj-edge-heritage { position: absolute; bottom: -1px; left: 0; right: 0; height: 35px; background-color: #fdfbf7; -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgMzAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCwxOC4zODQ2MjQ5OTI5MDYzNzUgMTAsMTYuOTk5MTM2ODM2NDQ2NzYgMjAsMTUuMTQwMjM2MjI3OTMwMzQzIDMwLDE4LjIxODA1NjA3MzM4OTU2MiA0MCwyMi4wMjY2NTE4NjgwODU3OCA1MCwxOC41NTM4OTMwNTc5OTY2NDYgNjAsMTYuOTczNzI1MDE0NTM1NDQgNzAsMTUuMTQxNDA1MzgxNjExNTEzIDgwLDE5Ljc1MTUxNjk1MTc1NDk0NCA5MCwxOS4xNTgxMTczODkzNzk4NCAxMDAsMjEuMzI2MDQxMDcwNDc4OTY1IDExMCwxOS43NDc1Njg5MzcyMTYwODQgMTIwLDIyLjg1MjcxOTkyODMwNzkwMiAxMzAsMTkuMDc0NTQ1Nzk2MTQ1MDc4IDE0MCwxOC4xNjI4MDI4MDA5NzY1ODYgMTUwLDE4LjQ4OTQ4NzIwNDY3OTg2IDE2MCwxNS4zMDA4MDk4NzIyODUyMTIgMTcwLDE1LjYyMDY3MTcxMTI0MjA5NCAxODAsMjIuNTAwNTg2NDI5NTAxMTQgMTkwLDIxLjkyNjYzODgzNjAyOTMgMjAwLDE4LjYyNjc4OTQyNzA5MjYwNCAyMTAsMTcuOTMwMTM1NjgzNzcyMzg4IDIyMCwxNS4xNzEyNTUyNzgyODQ0MyAyMzAsMjIuNDkzOTc2MzIyODE0NjkgMjQwLDIxLjA2NjgzNzQ2MjAxMDMxMiAyNTAsMTYuMzg5NTAxNTc3NjUwMDk0IDI2MCwxNS44NDEwNTk2NDI3OTY5ODMgMjcwLDIyLjE1ODIzNzI5MTcyMzk5MiAyODAsMjIuNzM3Mjc2MTA4Njc0MDg4IDI5MCwxNy4xNDExMDQwNjQ5NDU4MyAzMDAsMjIuNDAyMDg5NDc1NzkzODggMzEwLDE1LjQzOTM3MDc3NDkxMTQ0IDMyMCwyMS4zMDAwNjMyOTQ0ODcxNzggMzMwLDIxLjMwOTM1NzY5Njk2MTE3IDM0MCwyMS45Mzg5MDM2ODM2Njc2MDQgMzUwLDE4LjkwNDMzNDQ2NzMzMzI2OCAzNjAsMjIuMTk3NTMyOTA5NTkyMTg0IDM3MCwyMi40NTI4Mjc4ODkwMDEzNDggMzgwLDE1Ljg1NDU3OTA0NDM3NjAzMyAzOTAsMTUuMTg2NjY3Mzg1OTI1MDE4IDQwMCwyMC45OTk1MzgwNjkwOTA5MiA0MTAsMjIuNjcyOTM1NzgyMjAzNjQgNDIwLDE1Ljk0NTIzMTc1MTcxMjc3OSA0MzAsMjAuODgyNzIxMjczMzU2OTUgNDQwLDIwLjU3OTQzODI3MTE1NDA2IDQ1MCwyMi44MzUwNzgxOTQ5MzI5OCA0NjAsMjAuNzUwMzY4MDU5Mzk1NDQ1IDQ3MCwyMC44ODU5MzAwNTcxODM4NTYgNDgwLDE2LjQ1ODUxOTE0MTk4NjAzIDQ5MCwyMC41NzQ3ODYzMDc1NDI1MDMgNTAwLDE2Ljc3Mjk3NDYyNjkzMTMzMyA1MTAsMTcuODgyNTMxMDEyOTUyNzU0IDUyMCwxNS41MTY4MzM3Mzc2MTM1NDQgNTMwLDE1Ljc5OTc0MjA2MjE1NDg4OCA1NDAsMTYuODgxMzkyNjc3MDA1Mzg3IDU1MCwxOS42NDg3OTY3NDIzNDE4ODcgNTYwLDE2LjAxMjE2OTM5MzA4OTI4IDU3MCwxNy4wNzE1ODU2MjEzODYwMDYgNTgwLDE5LjU5NjU0NDIxMDc4NTI5IDU5MCwyMi4wMDIzMzU3MzIxMDA4OTYgNjAwLDE4LjY3OTExOTEzNTIzMzEzMyA2MTAsMjIuOTAwMjE4NDAyNTk3OTY4IDYyMCwyMC4wMDYzNTE2MjQ2Mzc0MzIgNjMwLDE2LjQ1MTgyODQyOTcwNTU0IDY0MCwxOS40MjgwMDEwOTc5MDQ3MjMgNjUwLDE3LjI5MzY0NTQ4NDM1MjggNjYwLDE4LjgwOTg4OTU0NDY5NDQxIDY3MCwxOC43NzkxNTg4NjE4Njg0MSA2ODAsMTguNTgxMzk3NDg3Mjk1MjI0IDY5MCwyMi40MDM0NzU2NjY4NDUyNiA3MDAsMTcuMzY4NTg5MjQzNzQ2MDcyIDcxMCwyMS41NDA5NjQ1Njc3NzE0ODIgNzIwLDIwLjkwNDA5NTc5MjgzNjkgNzMwLDIwLjE3NzIzMzQ4NzUxNDg0NCA3NDAsMjEuOTA2MDk3MTk1MDM5MTg3IDc1MCwxOS43MDcwMzIxNDM5MTU0NzcgNzYwLDIyLjY2MjU4NTk3MTYwNzU0OCA3NzAsMjAuNTE2OTI0NjkwODI1NTMgNzgwLDE4LjQxMjEzMjQxNDE5MzM5NCA3OTAsMTYuMjM0MzUzOTk5NjgyMzQgODAwLDE2LjgxODkyNzIzMDI0NjE0IDgwMCwzMCAwLDMwIi8+PGNpcmNsZSBjeD0iMTU3LjkzODAyMTMzMDA1MDMiIGN5PSIxMS42Njc2Nzc5MTg3MzMzNzkiIHI9IjEuMTQ0NTE1ODQwOTQ2MTU2IiBvcGFjaXR5PSIwLjc2MDI3MTQ3MDU3MzYxNTQiLz48Y2lyY2xlIGN4PSI2MjguMzY2MTI5NTAyNzA0NiIgY3k9IjEwLjE3ODA2NjM3MDExNTcxNSIgcj0iMy4yNjY0NjE0NTAxMTEwMTQzIiBvcGFjaXR5PSIwLjY5ODI0MjMyODIyODgxNTMiLz48Y2lyY2xlIGN4PSIyNDUuMDc4NjcwNDg5NTk0ODYiIGN5PSIxMS4yMTMzODUxNjg2Njk2MjMiIHI9IjMuNDM4MzE4OTY5ODEzMDE0IiBvcGFjaXR5PSIwLjMyMDUyNDQ0MTk4NjcwMTA1Ii8+PGNpcmNsZSBjeD0iNjMuNDk3OTAyMzYyMzUzNTYiIGN5PSI4LjUzNjQyMDIxMDAxMDY3NSIgcj0iMS44MTExNzA4MzMwMTk0ODQ0IiBvcGFjaXR5PSIwLjk3NTcwNTYyNzk0NTM5NzciLz48Y2lyY2xlIGN4PSIyNjMuOTQ0NjE2Mjg5ODc3MiIgY3k9IjkuNjI5NDE2MjY5NzQ4MTExIiByPSIxLjg3MDU0NzkxNzc2ODY4NTciIG9wYWNpdHk9IjAuNjExMjQxODc4MzY4NzQyNCIvPjxjaXJjbGUgY3g9IjE3OC4zMzcwOTgxMTU3NTA5NiIgY3k9IjcuMjQwOTc5MDA4NDI3MzY0IiByPSIzLjgyNjAwNjUxMTMyODY1MzciIG9wYWNpdHk9IjAuNDIyODQ2Njc3OTAxOTU1MiIvPjxjaXJjbGUgY3g9IjczNS44MDAwOTU5MjQ5NTA0IiBjeT0iOS40MTA2Mzk2NjM0MDI0NjciIHI9IjEuMTU0OTYyNTExNjk4NjciIG9wYWNpdHk9IjAuMzM5MjI0NDAwMDMzMzE5MzMiLz48Y2lyY2xlIGN4PSIxOS41MDkwMzEzODk4MDc0MiIgY3k9IjkuODA1MTU3NzIxOTU2NjA2IiByPSIyLjk1MjI2MzY2MjEyNzAwNiIgb3BhY2l0eT0iMC4zOTgxNzQzMDkyMjYyNjc2Ii8+PGNpcmNsZSBjeD0iNzI2Ljk2MTU1ODI0Mjk2NTgiIGN5PSI5LjgzMDA1NDg2ODM5Mjc0IiByPSIyLjM2MjE5MjAwMDEyMDQ0MjYiIG9wYWNpdHk9IjAuOTAxNDMwMzg5OTc2Mzg3MSIvPjxjaXJjbGUgY3g9IjkxLjY4NjY5Njc4MTE0NjE4IiBjeT0iMTEuMDYzNTQ5OTU0NTQ1NzQ0IiByPSIyLjUxMDQzNTIzMjc0MzU0OCIgb3BhY2l0eT0iMC41OTQ2OTAwMjU2MzM4OTg1Ii8+PGNpcmNsZSBjeD0iNzA4LjQ4NTEzMDA1OTMxNTYiIGN5PSI3LjQ3MDYxNjk1MTEzMjUzNSIgcj0iMS44NzY2MTUxMzk1NzE1OTY0IiBvcGFjaXR5PSIwLjk1NTMxODg3MDc5Ii8+PGNpcmNsZSBjeD0iMTU1LjU5Nzc0MjE1NzgyNzUiIGN5PSI4LjcwNzM3MTM1NjYyMzI1IiByPSIzLjIwMjg1NDU3MzA0MzA1NTUiIG9wYWNpdHk9IjAuNTE2ODM4NDA2ODg1NTA1Ii8+PGNpcmNsZSBjeD0iNzY0LjM3ODc3NTY2NTk0MzMiIGN5PSIxNC44ODk5NzM3MzI1NDAyNTciIHI9IjIuMDU2MDUwNTM2Njg4OTU3NyIgb3BhY2l0eT0iMC43MTcyNjkzMzQwODgyMjY4Ii8+PGNpcmNsZSBjeD0iMjY0LjUwMjM5MDUyMTE3MzMiIGN5PSI3Ljg3MTI2NDg0MjA0MjUyOSIgcj0iMS40MzU3MjQ1NzUxMzU3MjYyIiBvcGFjaXR5PSIwLjg0MDIzMzEzMDc4NDg1MzYiLz48Y2lyY2xlIGN4PSI0OC4yMjUyMDYwNzAxOTk4OSIgY3k9IjE0LjM4NzEyNjI0MjI4NDk3MyIgcj0iMS42MDE4NzExODAxMDE5NTc4IiBvcGFjaXR5PSIwLjg5ODE4MTI1NjEyNTcwNzQiLz48Y2lyY2xlIGN4PSI3NDEuNDQ3MDY5MDcxNDUxNCIgY3k9IjE0LjkxMjY5OTIxMDc2MTgzOCIgcj0iMy45ODY5ODUxODE5OTkyNjQiIG9wYWNpdHk9IjAuODI2NTQ1NTc2NDY0MDYxIi8+PGNpcmNsZSBjeD0iNjAxLjUwMzE4MDcyNDI4ODgiIGN5PSIxMC43NzE4NDM4ODAyNDM4NTciIHI9IjMuNzI4NjgyMzAyOTM3MTA5MiIgb3BhY2l0eT0iMC40ODc4NzQ1NjQ0MjYzMTEzMyIvPjxjaXJjbGUgY3g9IjU2Mi4yMzEwNzU1ODMzMzI5IiBjeT0iMTAuMzU1MjA0OTMxODkzNzU2IiByPSIzLjQ5NzM3MjI0NzEzNTkxOSIgb3BhY2l0eT0iMC43OTQ3MjExNzg2MjQ2MjUxIi8+PGNpcmNsZSBjeD0iNzYuNTUwNjI0MzQ3NzcyNTMiIGN5PSIxMi40ODA5NDA5MDc1ODAzOTUiIHI9IjIuNjA4OTU4NTQ3OTY2NDA5NSIgb3BhY2l0eT0iMC43OTQwMjE3ODAwNzg2OTUxIi8+PGNpcmNsZSBjeD0iNjkuMDk0NTc4OTE1NDUwMSIgY3k9IjguNjgwMzM2NDU5MDg1ODE5IiByPSIxLjQ5MjU5NTMzMjg2ODUxOTgiIG9wYWNpdHk9IjAuMzg4ODc1ODkzNTYwOTI2NCIvPjxjaXJjbGUgY3g9IjYxNC4xMzQwMDY5Njc1MDgxIiBjeT0iMTEuMjM0MjE5NjQ5ODg1MzcyIiByPSIyLjg0OTQwMTYzMjUxNDgyNTciIG9wYWNpdHk9IjAuOTI5MDI3NjU1NjE5Nzc1MiIvPjxjaXJjbGUgY3g9IjE4MS4xNDM4ODA3MDA4MzA1NSIgY3k9IjExLjU3MzYxODAxNTc2NjAwOSIgcj0iMi4yNDk2NzgzNjY1MDcyNTYiIG9wYWNpdHk9IjAuNzEwMTQyMTc1OTI3NDM3MiIvPjxjaXJjbGUgY3g9IjY5NS44Mjk0OTk1MDAwNDQ3IiBjeT0iOS41MjA0NzI1NTMyMjMyIiByPSIxLjczODg4NjIwMjg1MTQwNzYiIG9wYWNpdHk9IjAuOTk5NjE4MjkwNzMwMDU3Ii8+PGNpcmNsZSBjeD0iNTg5LjEwMTQ1NjIyNTI0NDYiIGN5PSIxMy41MTIzOTg3MjQ5NTIzNTkiIHI9IjIuNDI4NzM2OTY0OTU0OTY3MyIgb3BhY2l0eT0iMC43MzE2OTk4MjA2NjE5NTU3Ii8+PGNpcmNsZSBjeD0iMjUyLjAyNzY3NDI3MjA2ODQiIGN5PSI2LjUzODI4NDkxNTI5MTcxNCIgcj0iMS45NjM1OTA0MzY2MDczOTk1IiBvcGFjaXR5PSIwLjk4NzQ5NjU4OTI4NTk2NDQiLz48Y2lyY2xlIGN4PSI3NDcuMzM3NjUzNjUyNTU4MSIgY3k9IjEzLjgyNTY1NzMxOTUyNzY5MyIgcj0iMy42Mzc4ODYwMjQ3Njc2MzYzIiBvcGFjaXR5PSIwLjk4MTk3NTk3MDU3MjA2MTkiLz48Y2lyY2xlIGN4PSI3MTYuMjg3NzA3MjY5MjI0NCIgY3k9IjguMzI4Nzk0NTgyODAwNTA5IiByPSIyLjM1MDk1MjQyMTI1MDU4ODYiIG9wYWNpdHk9IjAuOTY4NzE4NTYxNzQzNjIzNCIvPjxjaXJjbGUgY3g9IjQwLjU4MzI4MDkzMzA2NTYiIGN5PSI5Ljk5ODk0OTIwNTIzMDcyMyIgcj0iMi4xMjEwMzE4MjM1ODAxMzY0IiBvcGFjaXR5PSIwLjgzNzUzMjc0MzQ1OTQyOCIvPjxjaXJjbGUgY3g9IjY0MC42Nzc2Mzk2NTY0MjA1IiBjeT0iOC41MTg4Njc4ODE1ODE1NjciIHI9IjEuOTAyNjQwMTcwNTQ0NTQ0NiIgb3BhY2l0eT0iMC41OTA2MTQ4MzY1NDYwNTg4Ii8+PGNpcmNsZSBjeD0iNTkxLjI1MjA5ODQxNDQzOTQiIGN5PSI3LjUxNDkxNDk3Nzg1MDQ5OCIgcj0iMi40MDMzNjU5MjQ4MjE4OTIiIG9wYWNpdHk9IjAuNzExMTY3MDkwMjkyOTgzNiIvPjxjaXJjbGUgY3g9IjQwNC4xNDQ5OTA3NDM0MjEyIiBjeT0iNS45Nzk2OTMwMDE2MDI0NTgiIHI9IjIuNjcyODU4NzQ2NTMwMDcxMyIgb3BhY2l0eT0iMC42NTEwMTAwNDQxNDE5NjMiLz48Y2lyY2xlIGN4PSI0NTUuNzYwOTE5NzgxOTE2NDciIGN5PSIxNC40NDcxNDY1MDY2MDI2MDciIHI9IjIuNzgwMTQzNDg4MDcyMjY2IiBvcGFjaXR5PSIwLjk5MzkzMjY1NTYzMDczNTUiLz48Y2lyY2xlIGN4PSI1NDIuMzM0NDQwMjI4NDQ2OSIgY3k9IjkuNzk1NDc4NzgwNDQxOTMiIHI9IjMuMDMwNzY1NzAzOTA2Njc5MyIgb3BhY2l0eT0iMC43Mjc2MDU5Mzk4MTMxNDU4Ii8+PGNpcmNsZSBjeD0iNjc4LjE4MzkyODIwMTUxNDIiIGN5PSIxMC45NDU5OTU4ODQ1OTMyMDciIHI9IjMuNzEwMDQyNzA5MTc4Njk5NCIgb3BhY2l0eT0iMC40NDg5Njc1NTIxNTQ1NjcyIi8+PGNpcmNsZSBjeD0iNjg0LjM1ODUwNTgxOTkyODYiIGN5PSIxMC41NjYwODI0NjE2MjcxMTkiIHI9IjMuMjA0MzQwMTg2ODA5OTE2IiBvcGFjaXR5PSIwLjQyNjgxNDA3NjUwMDU2OTIiLz48Y2lyY2xlIGN4PSI0MTYuMzYzMDU3MjIzNTM3MzQiIGN5PSI4LjMzMjIxNDM0NjQ3MjU5NyIgcj0iMi40NTAzODAwODgzNTcxMzYiIG9wYWNpdHk9IjAuMzM0NTgzOTk2OTQ0NTcxOSIvPjxjaXJjbGUgY3g9IjUwLjY4NTUzOTU5OTcyODczIiBjeT0iNi4xOTg0OTMyNTI1MTQ4NDgiIHI9IjIuMzQ1NDgxMzMwOTExNTU2NyIgb3BhY2l0eT0iMC45ODE5MDgwOTU4MDM0OTI5Ii8+PGNpcmNsZSBjeD0iNDgzLjc3MjY2NTgxNjI3NTU1IiBjeT0iOS4xMjQ0MDU0MzE2NjY4ODEiIHI9IjEuNDI4MTk0OTQzNTYxMjU1MyIgb3BhY2l0eT0iMC45NTU0MDMzMjEzNjYyNTcyIi8+PGNpcmNsZSBjeD0iMzkxLjAwNzY4MTk5MDY0MTQ2IiBjeT0iMTEuNTc4MjQ5MDEyOTc1MjQiIHI9IjEuMjgwODQxODYwNzY5NTU2NCIgb3BhY2l0eT0iMC45MTE0MjUwNzM0NTkwMTM1Ii8+PGNpcmNsZSBjeD0iMjA4LjgwMzEzMzE5NjU0NzEiIGN5PSI1LjcxMzY3NDQ5NjIwMjQzNiIgcj0iMy43MjE3Mzc4ODE0MjQzMjkiIG9wYWNpdHk9IjAuNTM2ODY2MjkyMDA3NDgxNCIvPjwvc3ZnPg=='); -webkit-mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; z-index: 20; pointer-events: none; }
      </style>
      <!-- Hero -->
      <section style="position: relative; height: 80vh; min-height: 600px; display: flex; align-items: center; justify-content: center; color: white; text-align: center; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />
        <div style="position: absolute; inset: 0; background-color: rgba(40, 20, 10, 0.4); z-index: 1; pointer-events: none;"></div>
        <div class="cj-edge-heritage" style="z-index: 2;"></div>
        <div style="position: relative; z-index: 10; max-width: 800px; padding: 20px;">
          <div style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; color: #fde68a;">Cố Đô • Di Sản</div>
          <h1 class="cj-heading" style="font-size: 4.5rem; font-weight: 700; margin-bottom: 20px; line-height: 1.1; text-shadow: 0 4px 10px rgba(0,0,0,0.5); color: #fff;">Dấu Ấn Thời Gian</h1>
          <p style="font-size: 1.15rem; margin-bottom: 40px; font-weight: 300; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.9;">Tìm về những giá trị lịch sử và di sản văn hóa trường tồn của dân tộc qua những công trình ngàn năm tuổi.</p>
          <a href="#main-content" style="display: inline-flex; align-items: center; padding: 14px 36px; background-color: transparent; border: 1px solid #fff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s;" onmouseover="this.style.backgroundColor='#fff'; this.style.color='#111';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#fff';">
            Lắng nghe lịch sử <span style="margin-left: 8px;">→</span>
          </a>
        </div>
      </section>

      <!-- Nội dung chính -->
      <section id="main-content" style="padding: 120px 20px; background-color: #fdfbf7;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 class="cj-heading" style="font-size: 3rem; font-weight: 600; color: #451a03; margin-bottom: 30px;">Hành trình xuyên qua thế kỷ</h2>
          <div style="width: 60px; height: 2px; background-color: #b45309; margin: 0 auto 30px auto;"></div>
          <p style="color: #4b5563; line-height: 1.8; font-size: 1.125rem; font-weight: 300;">Nơi lưu giữ những tinh hoa văn hóa truyền thống, những công trình kiến trúc cổ kính được cha ông ta dày công xây đắp. Hãy cùng tản bộ qua những con phố nhuốm màu thời gian, chạm tay vào những bức tường rêu phong để cảm nhận nhịp đập của lịch sử hào hùng.</p>
        </div>
      </section>

      <!-- Grid nổi bật -->
      <style>
        @media (min-width: 768px) { .cj-stagger-down { transform: translateY(60px); } }
      </style>
      <section style="padding: 40px 20px 140px 20px; background-color: #fdfbf7;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; padding-top: 20px;">
          <div style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1555581699-db01be5c2e99?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #451a03; margin-bottom: 10px;">Lăng Tẩm</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Khám phá kiến trúc hoàng cung cổ kính ẩn mình dưới bóng cây râm mát.</p>
            </div>
          </div>
          <div class="cj-stagger-down" style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1549488344-c116c906a237?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #451a03; margin-bottom: 10px;">Chùa Chiền</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Tìm về chốn tâm linh thanh tịnh và cảm nhận sự an nhiên trong tâm hồn.</p>
            </div>
          </div>
          <div style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1621360841013-c76831f162cb?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #451a03; margin-bottom: 10px;">Làng Nghề</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Lưu giữ những giá trị thủ công truyền thống qua bàn tay nghệ nhân.</p>
            </div>
          </div>
          <div class="cj-stagger-down" style="background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.04); transition: transform 0.3s ease;">
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 320px; object-fit: cover;" />
            <div style="padding: 25px;">
              <h4 class="cj-heading" style="font-size: 1.3rem; font-weight: 600; color: #451a03; margin-bottom: 10px;">Lễ Hội</h4>
              <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.6;">Hòa mình vào không khí sôi động của các lễ hội văn hóa dân gian.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Nội dung phụ -->
      <section style="padding: 80px 20px 120px 20px; background-color: #fff;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 80px;">
          <div style="flex: 1; min-width: 300px; position: relative;">
            <div style="position: absolute; top: 30px; left: -30px; bottom: -30px; right: 30px; border: 1px solid #b45309; z-index: 0;"></div>
            <img src="https://images.unsplash.com/photo-1549488344-c116c906a237?auto=format&fit=crop&w=800&q=80" alt="Di tích" style="width: 100%; position: relative; z-index: 1; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
          </div>
          <div style="flex: 1; min-width: 300px; padding: 20px;">
            <div style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; font-weight: 600; color: #b45309; margin-bottom: 15px;">Tinh Hoa Văn Hóa</div>
            <h3 class="cj-heading" style="font-size: 2.5rem; font-weight: 600; color: #451a03; margin-bottom: 30px;">Vẻ đẹp trường tồn</h3>
            <p style="color: #4b5563; line-height: 1.8; font-size: 1.05rem; font-weight: 300; margin-bottom: 30px;">Lắng nghe tiếng vọng của thời gian qua từng cổ vật, từng đường nét chạm trổ tinh xảo.</p>
            <ul style="list-style: none; padding: 0; margin: 0; color: #451a03; font-size: 1.05rem; line-height: 2.5; font-weight: 400;">
              <li style="border-bottom: 1px solid #fde68a; padding-bottom: 10px; margin-bottom: 10px;"><strong>Khám phá cổ vật:</strong> Chiêm ngưỡng những hiện vật quý giá.</li>
              <li style="border-bottom: 1px solid #fde68a; padding-bottom: 10px; margin-bottom: 10px;"><strong>Tìm hiểu kiến trúc:</strong> Tham quan các lăng tẩm, đền đài uy nghi.</li>
              <li style="border-bottom: 1px solid #fde68a; padding-bottom: 10px; margin-bottom: 10px;"><strong>Thưởng thức nghệ thuật:</strong> Nhã nhạc cung đình và ca trù truyền thống.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Album ảnh -->
      <section style="padding: 100px 20px; background-color: #fdfbf7; text-align: center;">
        <h2 class="cj-heading" style="font-size: 2.5rem; font-weight: 600; color: #451a03; margin-bottom: 20px;">Những Khung Hình Hoài Niệm</h2>
        <p style="color: #b45309; margin-bottom: 50px; font-weight: 300;">Dừng chân và chiêm ngưỡng nghệ thuật kiến trúc</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; max-width: 1200px; margin: 0 auto;">
          <img src="https://images.unsplash.com/photo-1559592413-7cea4ee5e135?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
          <img src="https://images.unsplash.com/photo-1559098522-a5e2f785bc0b?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
          <img src="https://images.unsplash.com/photo-1579730538965-7484dfcebb31?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
          <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" />
        </div>
      </section>
    </div>
  `,
  city: `
    <div style="font-family: 'Roboto', sans-serif; color: #fff; background-color: #0f172a;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        .cj-neon { text-shadow: 0 0 10px rgba(56, 189, 248, 0.8), 0 0 20px rgba(56, 189, 248, 0.4); }
        .cj-glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
        .cj-hover-up { transition: transform 0.3s ease; }
        .cj-hover-up:hover { transform: translateY(-10px); }
      </style>
      <section style="position: relative; height: 90vh; min-height: 600px; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1920&q=80" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 1)); z-index: 1;"></div>
        <div style="position: relative; z-index: 10; max-width: 800px; padding: 20px;">
          <h1 class="cj-neon" style="font-size: 5rem; font-weight: 900; margin-bottom: 20px; line-height: 1.1; letter-spacing: -2px;">Đô Thị Phồn Hoa</h1>
          <p style="font-size: 1.25rem; margin-bottom: 40px; font-weight: 300; opacity: 0.9;">Hòa mình vào nhịp sống không ngủ, rực rỡ ánh đèn và những trải nghiệm giải trí đỉnh cao.</p>
          <a href="#explore" style="display: inline-block; padding: 16px 40px; background: #38bdf8; color: #0f172a; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 1.1rem; box-shadow: 0 0 20px rgba(56,189,248,0.5);">Khám Phá Ngay</a>
        </div>
      </section>
      
      <section id="explore" style="padding: 100px 20px; background-color: #0f172a;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3rem; font-weight: 700; color: #f8fafc; margin-bottom: 15px;">Điểm Đến Sôi Động</h2>
            <div style="width: 80px; height: 3px; background-color: #38bdf8; margin: 0 auto;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
            <div class="cj-glass cj-hover-up" style="padding: 30px; text-align: left;">
              <div style="width: 60px; height: 60px; background: rgba(56,189,248,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #38bdf8; font-size: 24px;">🏢</div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; color: #fff;">Chọc Trời</h3>
              <p style="color: #94a3b8; line-height: 1.7;">Ngắm nhìn toàn cảnh thành phố từ những tòa nhà chọc trời hiện đại nhất.</p>
            </div>
            <div class="cj-glass cj-hover-up" style="padding: 30px; text-align: left;">
              <div style="width: 60px; height: 60px; background: rgba(167,139,250,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #a78bfa; font-size: 24px;">🌃</div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; color: #fff;">Về Đêm</h3>
              <p style="color: #94a3b8; line-height: 1.7;">Khám phá nhịp sống về đêm với những quán bar, pub và ẩm thực đường phố.</p>
            </div>
            <div class="cj-glass cj-hover-up" style="padding: 30px; text-align: left;">
              <div style="width: 60px; height: 60px; background: rgba(251,113,133,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #fb7185; font-size: 24px;">🛍️</div>
              <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; color: #fff;">Mua Sắm</h3>
              <p style="color: #94a3b8; line-height: 1.7;">Thiên đường mua sắm với hàng ngàn thương hiệu nổi tiếng thế giới.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section style="padding: 0; display: flex; flex-wrap: wrap;">
        <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80" style="flex: 1; min-width: 300px; height: 400px; object-fit: cover;" />
        <img src="https://images.unsplash.com/photo-1477959858617-6c0841fca1bc?auto=format&fit=crop&w=800&q=80" style="flex: 1; min-width: 300px; height: 400px; object-fit: cover;" />
        <img src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80" style="flex: 1; min-width: 300px; height: 400px; object-fit: cover;" />
      </section>
      
      <!-- Section 4: Info -->
      <section style="padding: 60px 20px; background: #0f172a;">
        <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 40px;">Văn Hóa & Nhịp Sống</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; text-align: left;">
            <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
              <h3 style="color: #38bdf8; font-size: 1.5rem; margin-bottom: 15px;">Dấu Ấn Lịch Sử</h3>
              <p style="color: #cbd5e1; line-height: 1.7;">Đan xen giữa những tòa nhà chọc trời hiện đại là những khu phố cổ kính lưu giữ hàng trăm năm lịch sử hình thành và phát triển của vùng đất này.</p>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
              <h3 style="color: #38bdf8; font-size: 1.5rem; margin-bottom: 15px;">Nhịp Trẻ Năng Động</h3>
              <p style="color: #cbd5e1; line-height: 1.7;">Khi màn đêm buông xuống, thành phố khoác lên mình tấm áo ánh sáng rực rỡ với các hoạt động giải trí đa dạng suốt đêm.</p>
            </div>
          </div>
        </div>
      </section>
      <!-- Section 5: Transport -->
      <section style="padding: 80px 20px; background: linear-gradient(135deg, #1e293b, #0f172a); text-align: center;">
        <h2 style="font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 20px;">Hướng Dẫn Di Chuyển</h2>
        <p style="color: #94a3b8; font-size: 1.1rem; max-width: 800px; margin: 0 auto; line-height: 1.8;">Hệ thống giao thông công cộng tại đây vô cùng phát triển. Du khách có thể dễ dàng sử dụng tàu điện ngầm (Metro) để đi đến tất cả các điểm tham quan chính trong thành phố với chi phí tiết kiệm nhất.</p>
      </section>
    </div>
  `,
  nature: `
    <div style="font-family: 'Georgia', serif; color: #4a5568; background-color: #fffaf0;">
      <style>
        .cj-title { font-family: 'Playfair Display', serif; }
        .cj-card { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
      </style>
      <section style="position: relative; height: 85vh; min-height: 600px; display: flex; align-items: center; padding: 0 10%; overflow: hidden;">
        <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 60%; background-image: url('https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center; border-bottom-left-radius: 100px;"></div>
        <div style="position: relative; z-index: 10; max-width: 500px; background: rgba(255,255,255,0.9); padding: 50px; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
          <div style="text-transform: uppercase; letter-spacing: 3px; font-size: 0.8rem; font-weight: bold; color: #d53f8c; margin-bottom: 20px;">Trải nghiệm thiên nhiên</div>
          <h1 class="cj-title" style="font-size: 4rem; color: #2d3748; line-height: 1.1; margin-bottom: 20px;">Giai Điệu<br/><span style="color: #d53f8c;">Mùa Xuân</span></h1>
          <p style="font-size: 1.1rem; line-height: 1.8; color: #718096; margin-bottom: 30px;">Hít thở bầu không khí trong lành, ngắm nhìn ngàn hoa khoe sắc và tận hưởng sự bình yên tuyệt đối.</p>
          <button style="background: #d53f8c; color: white; border: none; padding: 15px 35px; border-radius: 50px; font-size: 1.1rem; font-weight: bold; cursor: pointer; box-shadow: 0 10px 20px rgba(213,63,140,0.3);">Chi tiết</button>
        </div>
      </section>
      
      <section style="padding: 100px 20px; background-color: #fffaf0;">
        <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
          <h2 class="cj-title" style="font-size: 3rem; color: #2d3748; margin-bottom: 20px;">Vẻ Đẹp Thuần Khiết</h2>
          <p style="font-size: 1.2rem; color: #718096; margin-bottom: 60px; max-width: 700px; margin-left: auto; margin-right: auto;">Nơi đất trời giao hòa, vạn vật sinh sôi. Một bản tình ca của tự nhiên dành tặng cho những tâm hồn lãng mạn.</p>
          
          <div style="display: flex; gap: 40px; justify-content: center; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 280px; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.08);">
              <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 250px; object-fit: cover;" />
              <div style="background: white; padding: 25px;">
                <h3 class="cj-title" style="font-size: 1.5rem; color: #2d3748; margin-bottom: 10px;">Thung Lũng</h3>
                <p style="color: #718096;">Dạo bước trên những thảm cỏ xanh mướt.</p>
              </div>
            </div>
            <div style="flex: 1; min-width: 280px; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.08); transform: translateY(-20px);">
              <img src="https://images.unsplash.com/photo-1490750967868-88cb4ca2658c?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 250px; object-fit: cover;" />
              <div style="background: white; padding: 25px;">
                <h3 class="cj-title" style="font-size: 1.5rem; color: #2d3748; margin-bottom: 10px;">Đồng Hoa</h3>
                <p style="color: #718096;">Ngây ngất trong hương thơm dịu nhẹ.</p>
              </div>
            </div>
            <div style="flex: 1; min-width: 280px; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.08);">
              <img src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 250px; object-fit: cover;" />
              <div style="background: white; padding: 25px;">
                <h3 class="cj-title" style="font-size: 1.5rem; color: #2d3748; margin-bottom: 10px;">Suối Nguồn</h3>
                <p style="color: #718096;">Gột rửa muộn phiền theo dòng nước mát.</p>
              </div>
            </div>
          </div>
      <section style="padding: 60px 20px; background: #fff;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 style="font-size: 2.5rem; color: #2d3748; margin-bottom: 20px; text-align: center;">Đa Dạng Sinh Học</h2>
          <p style="color: #718096; font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px; text-align: center; max-width: 800px; margin-left: auto; margin-right: auto;">Nơi đây là ngôi nhà của hàng trăm loài thực vật và động vật quý hiếm. Từng tán cây, kẽ lá đều ẩn chứa sự sống diệu kỳ đang chờ bạn đến tìm hiểu và khám phá.</p>
        </div>
      </section>
      <section style="padding: 80px 20px; background: #fdf2f8; text-align: center;">
         <h2 style="font-size: 2.5rem; color: #831843; margin-bottom: 20px;">Lưu Ý Bảo Vệ Môi Trường</h2>
         <p style="color: #9d174d; margin-bottom: 20px; max-width: 800px; margin-left: auto; margin-right: auto; line-height: 1.8;">Du khách vui lòng tuân thủ các quy định về rác thải, không hái hoa bẻ cành và tôn trọng các loài động vật hoang dã để cùng nhau giữ gìn vẻ đẹp tự nhiên này cho thế hệ tương lai.</p>
      </section>
    </div>
  `,
  adventure: `
    <div style="font-family: 'Roboto Condensed', sans-serif; color: #fff; background-color: #111;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
        .cj-adv-btn { background: #f97316; color: #fff; text-transform: uppercase; padding: 15px 30px; font-weight: 700; transform: skewX(-10deg); display: inline-block; transition: all 0.3s; }
        .cj-adv-btn:hover { background: #ea580c; transform: skewX(-10deg) scale(1.05); }
        .cj-adv-card { background: #222; border-left: 5px solid #f97316; padding: 30px; transition: all 0.3s; }
        .cj-adv-card:hover { transform: translateX(10px); }
      </style>
      <section style="position: relative; height: 90vh; min-height: 600px; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);">
        <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1920&q=80" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6;" />
        <div style="position: relative; z-index: 10; max-width: 900px; padding: 20px;">
          <h1 style="font-size: 6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 20px; text-shadow: 4px 4px 0 #f97316;">Vượt Giới Hạn</h1>
          <p style="font-size: 1.5rem; font-family: 'Inter', sans-serif; margin-bottom: 40px; color: #d1d5db;">Đánh thức bản năng khám phá, chinh phục những đỉnh cao mới.</p>
          <a href="#" class="cj-adv-btn"><span style="display: inline-block; transform: skewX(10deg);">Bắt Đầu Hành Trình</span></a>
        </div>
      </section>
      
      <section style="padding: 100px 20px; background-color: #111;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          <div class="cj-adv-card">
            <h3 style="font-size: 2rem; margin-bottom: 15px; color: #f97316;">01. Leo Núi</h3>
            <p style="font-family: 'Inter', sans-serif; color: #9ca3af; line-height: 1.6;">Chinh phục những vách đá dựng đứng và tận hưởng cảm giác chiến thắng.</p>
          </div>
          <div class="cj-adv-card">
            <h3 style="font-size: 2rem; margin-bottom: 15px; color: #f97316;">02. Thám Hiểm Hang Động</h3>
            <p style="font-family: 'Inter', sans-serif; color: #9ca3af; line-height: 1.6;">Đi sâu vào lòng đất để khám phá những kỳ quan thiên nhiên kỳ bí.</p>
          </div>
          <div class="cj-adv-card">
            <h3 style="font-size: 2rem; margin-bottom: 15px; color: #f97316;">03. Vượt Thác</h3>
            <p style="font-family: 'Inter', sans-serif; color: #9ca3af; line-height: 1.6;">Đương đầu với dòng nước xiết và thử thách lòng dũng cảm.</p>
          </div>
        </div>
      </section>

      <section style="padding: 80px 20px; background: #1a1a1a;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 style="font-size: 2.5rem; color: #fff; margin-bottom: 40px; text-transform: uppercase; text-align: center;">Yêu Cầu Thể Lực & Kỹ Năng</h2>
          <div style="background: #222; padding: 40px; border-left: 5px solid #f97316;">
            <p style="color: #aaa; line-height: 1.8; margin-bottom: 20px; font-family: 'Inter', sans-serif;">Hành trình này đòi hỏi du khách phải có một nền tảng thể lực tốt và không mắc các bệnh về tim mạch, huyết áp. Việc đi bộ đường dài qua địa hình đồi núi dốc đứng liên tục trong nhiều giờ sẽ là một thử thách thực sự.</p>
            <p style="color: #aaa; line-height: 1.8; font-family: 'Inter', sans-serif;">Kinh nghiệm trekking trước đây không bắt buộc, nhưng du khách cần có tinh thần kỷ luật, tuân thủ tuyệt đối hướng dẫn của trưởng đoàn để đảm bảo an toàn tuyệt đối trong suốt chuyến đi.</p>
          </div>
        </div>
      </section>
      <section style="padding: 80px 20px; background: #111; border-top: 1px solid #333;">
        <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
           <h2 style="font-size: 2.5rem; color: #ea580c; text-transform: uppercase; margin-bottom: 30px;">Danh Mục Đồ Cá Nhân Cần Mang</h2>
           <p style="color: #888; font-family: 'Inter', sans-serif; max-width: 700px; margin: 0 auto; line-height: 1.8;">Nên ưu tiên trang phục mỏng nhẹ, thấm hút mồ hôi. Một đôi giày trekking chuyên dụng có độ bám tốt là yếu tố sống còn. Ngoài ra, cần mang theo áo khoác gió chống nước, thuốc chống côn trùng và một số loại thuốc cá nhân cơ bản.</p>
        </div>
      </section>
    </div>
  `,
  resort: `
    <div style="font-family: 'Playfair Display', serif; color: #333; background-color: #fcfcfc;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400&display=swap');
        .cj-resort-text { font-family: 'Montserrat', sans-serif; font-weight: 300; line-height: 2; color: #666; }
      </style>
      <section style="height: 100vh; display: flex; align-items: center; justify-content: space-between; padding: 0 5%; background: #fff; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px; max-width: 500px; padding: 40px;">
          <p style="font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 4px; color: #cda434; font-size: 0.8rem; margin-bottom: 20px;">Trải Nghiệm Đẳng Cấp</p>
          <h1 style="font-size: 3.5rem; color: #1a1a1a; margin-bottom: 30px; line-height: 1.2;">Nghỉ Dưỡng<br/>Thượng Lưu</h1>
          <p class="cj-resort-text" style="margin-bottom: 40px;">Tận hưởng không gian sang trọng, dịch vụ hoàn hảo và những phút giây thư giãn tuyệt đối tại thiên đường nghỉ dưỡng của chúng tôi.</p>
          <a href="#" style="font-family: 'Montserrat', sans-serif; display: inline-block; padding: 15px 40px; border: 1px solid #1a1a1a; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; transition: all 0.3s; font-size: 0.9rem;">Khám Phá</a>
        </div>
        <div style="flex: 1; min-width: 300px; height: 80vh;">
          <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80" style="width: 100%; height: 100%; object-fit: cover; border-radius: 200px 200px 0 0;" />
        </div>
      </section>
      
      <section style="padding: 120px 5%; background: #f9f9f9; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 20px; color: #1a1a1a;">Tiện Ích 5 Sao</h2>
        <div style="width: 50px; height: 2px; background: #cda434; margin: 0 auto 60px;"></div>
        <div style="display: flex; gap: 40px; justify-content: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px; max-width: 350px;">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; margin-bottom: 20px;" />
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Spa & Wellness</h3>
            <p class="cj-resort-text">Phục hồi năng lượng tinh thần</p>
          </div>
          <div style="flex: 1; min-width: 250px; max-width: 350px;">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; margin-bottom: 20px;" />
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Fine Dining</h3>
            <p class="cj-resort-text">Ẩm thực tinh hoa thế giới</p>
          </div>
          <div style="flex: 1; min-width: 250px; max-width: 350px;">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 350px; object-fit: cover; margin-bottom: 20px;" />
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Private Pool</h3>
            <p class="cj-resort-text">Hồ bơi vô cực riêng tư</p>
          </div>
        </div>
      </section>
      
      <section style="padding: 80px 5%; background: #fff; display: flex; flex-wrap: wrap; align-items: center; gap: 40px;">
        <div style="flex: 1; min-width: 300px;">
          <h2 style="font-size: 2.5rem; margin-bottom: 20px; color: #1a1a1a;">Đánh Thức Giác Quan</h2>
          <p class="cj-resort-text" style="margin-bottom: 30px;">Mỗi khoảnh khắc tại đây đều được thiết kế tỉ mỉ để mang đến cho bạn sự trải nghiệm xa hoa và đáng nhớ nhất.</p>
          <ul style="list-style: none; padding: 0; font-family: 'Montserrat', sans-serif; color: #1a1a1a;">
            <li style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">✦ Kiến trúc độc bản</li>
            <li style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">✦ Dịch vụ cá nhân hóa 24/7</li>
            <li style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">✦ Gần gũi với thiên nhiên</li>
          </ul>
        </div>
        <div style="flex: 1; min-width: 300px; text-align: center;">
          <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80" style="width: 80%; height: auto; border: 10px solid #f9f9f9; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
        </div>
      </section>
      <section style="padding: 100px 5%; background: #1a1a1a; color: #fff; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 30px; color: #cda434;">Triết Lý Phục Vụ 5 Sao</h2>
        <p style="font-family: 'Montserrat', sans-serif; max-width: 800px; margin: 0 auto 40px; color: #aaa; line-height: 1.8;">Sự hài lòng của quý khách là thước đo thành công duy nhất của chúng tôi. Với đội ngũ quản gia cá nhân (Butler Service) túc trực 24/7, mọi nhu cầu từ nhỏ nhất đều được chăm sóc tỉ mỉ với thái độ chuyên nghiệp và tôn trọng tuyệt đối.</p>
      </section>
    </div>
  `,
  food: `
    <div style="font-family: 'Be Vietnam Pro', sans-serif; color: #4a4a4a; background-color: #fffaf0;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;800&family=Dancing+Script:wght@700&display=swap');
        .cj-food-title { font-family: 'Dancing Script', cursive; color: #e11d48; text-shadow: 2px 2px 0px rgba(0,0,0,0.05); }
        .cj-food-img { border-radius: 50%; border: 10px solid #fff; box-shadow: 0 15px 30px rgba(225,29,72,0.15); transition: transform 0.5s; }
        .cj-food-img:hover { transform: rotate(10deg) scale(1.05); }
      </style>
      <section style="padding: 80px 20px; display: flex; flex-wrap: wrap; align-items: center; max-width: 1200px; margin: 0 auto;">
        <div style="flex: 1; min-width: 300px; padding: 20px;">
          <h1 class="cj-food-title" style="font-size: 5rem; margin-bottom: 20px; line-height: 1.2;">Tinh Hoa<br/>Ẩm Thực</h1>
          <p style="font-size: 1.2rem; color: #666; line-height: 1.8; margin-bottom: 40px;">Hành trình đánh thức mọi giác quan qua những hương vị đặc trưng, món ăn đường phố nức tiếng và nghệ thuật nấu nướng truyền thống.</p>
          <button style="background: #e11d48; color: #fff; border: none; padding: 15px 35px; border-radius: 30px; font-weight: 600; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(225,29,72,0.3); cursor: pointer;">Xem Thực Đơn</button>
        </div>
        <div style="flex: 1; min-width: 300px; display: flex; justify-content: center; position: relative;">
          <img class="cj-food-img" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" style="width: 400px; height: 400px; object-fit: cover;" />
          <div style="position: absolute; bottom: 20px; right: 20px; background: #fff; padding: 15px 25px; border-radius: 20px; font-weight: 800; color: #e11d48; box-shadow: 0 10px 20px rgba(0,0,0,0.1); transform: rotate(-5deg);">Ngon Khó Cưỡng!</div>
        </div>
      </section>
      
      <section style="padding: 80px 20px; background: #fecdd3; text-align: center;">
        <h2 style="font-size: 2.5rem; font-weight: 800; color: #881337; margin-bottom: 50px;">Đặc Sản Không Thể Bỏ Lỡ</h2>
        <div style="display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; max-width: 1200px; margin: 0 auto;">
          <div style="background: #fff; padding: 30px; border-radius: 30px; flex: 1; min-width: 250px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h3 style="font-size: 1.5rem; color: #be123c; margin-bottom: 15px;">Đường Phố</h3>
            <p style="color: #666;">Thưởng thức những món ăn dân dã, đậm đà hương vị bản địa ngay trên những gánh hàng rong.</p>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 30px; flex: 1; min-width: 250px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h3 style="font-size: 1.5rem; color: #be123c; margin-bottom: 15px;">Truyền Thống</h3>
            <p style="color: #666;">Mâm cơm gia đình với những công thức bí truyền được lưu giữ qua nhiều thế hệ.</p>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 30px; flex: 1; min-width: 250px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h3 style="font-size: 1.5rem; color: #be123c; margin-bottom: 15px;">Hải Sản</h3>
            <p style="color: #666;">Tươi ngon đánh bắt trong ngày, chế biến đa dạng từ nướng mỡ hành đến hấp sả.</p>
          </div>
        </div>
      </section>

      <section style="padding: 80px 20px; background: #fff;">
        <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; color: #e11d48; margin-bottom: 40px;">Thực Đơn Đặc Sắc</h2>
          <div style="display: flex; gap: 30px; justify-content: center; flex-wrap: wrap;">
            <div style="text-align: center; max-width: 300px;">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80" style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" />
              <h3 style="font-size: 1.3rem; margin-bottom: 10px;">BBQ Thơm Lừng</h3>
              <p style="color: #666; font-size: 0.95rem;">Thịt nướng tảng thơm nức mũi, ăn kèm sốt cay độc quyền.</p>
            </div>
            <div style="text-align: center; max-width: 300px;">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80" style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" />
              <h3 style="font-size: 1.3rem; margin-bottom: 10px;">Pizza Truyền Thống</h3>
              <p style="color: #666; font-size: 0.95rem;">Đế mỏng giòn tan, phô mai béo ngậy chuẩn vị Ý.</p>
            </div>
            <div style="text-align: center; max-width: 300px;">
              <img src="https://images.unsplash.com/photo-1484723091791-c0d7f5474148?auto=format&fit=crop&w=300&q=80" style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" />
              <h3 style="font-size: 1.3rem; margin-bottom: 10px;">Tráng Miệng Ngọt Ngào</h3>
              <p style="color: #666; font-size: 0.95rem;">Kết thúc bữa ăn bằng những chiếc bánh ngọt tinh tế.</p>
            </div>
          </div>
        </div>
      </section>
      <section style="padding: 80px 20px; background: #ffe4e6; text-align: center;">
        <h2 style="font-size: 2.5rem; color: #be123c; margin-bottom: 20px;">Tinh Hoa Từ Đất Mẹ</h2>
        <p style="color: #881337; margin-bottom: 40px; font-size: 1.1rem; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.8;">Chúng tôi tự hào sử dụng 100% nguyên liệu hữu cơ được thu hoạch ngay trong ngày từ các nông trại địa phương. Sự kết hợp giữa nguyên liệu tươi ngon và công thức chế biến gia truyền tạo nên hương vị không thể nào trộn lẫn.</p>
      </section>
    </div>
  `,
  festival: `
    <div style="font-family: 'Nunito', sans-serif; color: #fff; background-color: #0f766e;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
        .cj-fest-bg { background: linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%); }
        .cj-fest-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); }
      </style>
      <section class="cj-fest-bg" style="padding: 120px 20px; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50px; left: -50px; width: 300px; height: 300px; background: #f59e0b; border-radius: 50%; filter: blur(80px); opacity: 0.5;"></div>
        <div style="position: absolute; bottom: -50px; right: -50px; width: 300px; height: 300px; background: #ec4899; border-radius: 50%; filter: blur(80px); opacity: 0.5;"></div>
        
        <div style="position: relative; z-index: 10; max-width: 800px; margin: 0 auto;">
          <span style="background: #fef08a; color: #854d0e; padding: 5px 15px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Văn Hóa Bản Địa</span>
          <h1 style="font-size: 4.5rem; font-weight: 900; margin: 30px 0; line-height: 1.2;">Lễ Hội<br/>Truyền Thống</h1>
          <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 40px;">Đắm chìm trong không khí náo nhiệt, cờ hoa rực rỡ và những điệu múa say đắm lòng người.</p>
          <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80" style="width: 150px; height: 150px; border-radius: 20px; object-fit: cover; transform: rotate(-10deg); border: 5px solid #fff;" />
            <img src="https://images.unsplash.com/photo-1540324155970-14120287e076?auto=format&fit=crop&w=300&q=80" style="width: 150px; height: 150px; border-radius: 20px; object-fit: cover; transform: rotate(10deg); border: 5px solid #fff;" />
          </div>
        </div>
      </section>
      
      <section style="padding: 80px 20px; background: #fff; color: #333;">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: 800; color: #0f766e; margin-bottom: 40px;">Lịch Trình Sự Kiện</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: #f0fdfa; padding: 20px 30px; border-left: 5px solid #0d9488; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <div style="font-weight: bold; color: #0f766e; font-size: 1.2rem;">08:00 Sáng</div>
              <div style="flex: 1; margin-left: 20px; text-align: left; font-size: 1.1rem;">Khai mạc lễ hội và múa lân sư rồng</div>
            </div>
            <div style="background: #f0fdfa; padding: 20px 30px; border-left: 5px solid #0d9488; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <div style="font-weight: bold; color: #0f766e; font-size: 1.2rem;">14:00 Chiều</div>
              <div style="flex: 1; margin-left: 20px; text-align: left; font-size: 1.1rem;">Trò chơi dân gian và giao lưu văn nghệ</div>
            </div>
            <div style="background: #f0fdfa; padding: 20px 30px; border-left: 5px solid #0d9488; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <div style="font-weight: bold; color: #0f766e; font-size: 1.2rem;">20:00 Tối</div>
              <div style="flex: 1; margin-left: 20px; text-align: left; font-size: 1.1rem;">Đêm hội ánh sáng và bắn pháo hoa</div>
            </div>
          </div>
        </div>
      </section>
      <section style="padding: 80px 20px; text-align: center;" class="cj-fest-bg">
        <h2 style="font-size: 3rem; font-weight: 900; margin-bottom: 20px;">Bảo Tồn Bản Sắc</h2>
        <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 40px; max-width: 800px; margin-left: auto; margin-right: auto;">Lễ hội không chỉ là dịp vui chơi mà còn là thời khắc thiêng liêng để người dân địa phương thể hiện lòng biết ơn tổ tiên, cầu mong mưa thuận gió hòa và truyền đạt những giá trị văn hóa tốt đẹp cho thế hệ trẻ.</p>
      </section>
    </div>
  `,
  camping: `
    <div style="font-family: 'Merriweather', serif; color: #3e2723; background-color: #f1f8e9;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;700&family=Patrick+Hand&display=swap');
        .cj-camp-polaroid { background: #fff; padding: 15px 15px 40px 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); transform: rotate(-3deg); transition: transform 0.3s; }
        .cj-camp-polaroid:hover { transform: scale(1.05) rotate(0); z-index: 10; }
      </style>
      <section style="padding: 100px 20px; display: flex; flex-wrap: wrap; justify-content: center; gap: 60px; max-width: 1200px; margin: 0 auto; align-items: center;">
        <div style="flex: 1; min-width: 300px; max-width: 500px;">
          <h1 style="font-size: 3.5rem; font-weight: 700; color: #1b5e20; margin-bottom: 20px;">Trở Về<br/>Thiên Nhiên</h1>
          <div style="width: 60px; height: 4px; background: #8bc34a; margin-bottom: 30px;"></div>
          <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px; color: #5d4037;">Cắm trại giữa rừng thông xanh mát, đốt lửa sưởi ấm trong sương mù và đón bình minh ló rạng bên tách cà phê nóng hổi.</p>
          <ul style="list-style: none; padding: 0; line-height: 2;">
            <li>⛺ Glamping tiện nghi</li>
            <li>🔥 Đốt lửa trại BBQ</li>
            <li>🎸 Giao lưu âm nhạc</li>
          </ul>
        </div>
        <div style="flex: 1; min-width: 300px; position: relative; height: 500px;">
          <div class="cj-camp-polaroid" style="position: absolute; top: 0; left: 0; width: 250px;">
            <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 200px; object-fit: cover;" />
            <p style="text-align: center; margin-top: 15px; font-style: italic; color: #795548; font-family: 'Patrick Hand', cursive; font-size: 1.5rem;">Sáng sớm tinh sương</p>
          </div>
          <div class="cj-camp-polaroid" style="position: absolute; bottom: 0; right: 0; width: 280px; transform: rotate(5deg);">
            <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 220px; object-fit: cover;" />
            <p style="text-align: center; margin-top: 15px; font-style: italic; color: #795548; font-family: 'Patrick Hand', cursive; font-size: 1.5rem;">Lửa trại ấm áp</p>
          </div>
        </div>
      </section>
      
      <section style="padding: 80px 20px; background: #fff;">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 40px;">
          <div style="flex: 1; min-width: 300px;">
             <h2 style="font-family: 'Patrick Hand', cursive; font-size: 3rem; color: #5d4037; margin-bottom: 20px;">Chuẩn Bị Gì Cho Chuyến Đi?</h2>
             <p style="color: #6d4c41; line-height: 1.8; margin-bottom: 30px;">Để có một chuyến cắm trại trọn vẹn, chúng tôi đã chuẩn bị sẵn sàng những vật dụng cần thiết nhất cho bạn.</p>
             <ul style="list-style: none; padding: 0; color: #4e342e;">
               <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="font-size: 1.5rem; margin-right: 15px;">⛺</span> Lều Mông Cổ chống nước 100%</li>
               <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="font-size: 1.5rem; margin-right: 15px;">🛏️</span> Đệm hơi và túi ngủ giữ nhiệt</li>
               <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="font-size: 1.5rem; margin-right: 15px;">🍖</span> Bếp nướng BBQ và bộ nồi cắm trại</li>
             </ul>
          </div>
          <div style="flex: 1; min-width: 300px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
             <img src="https://images.unsplash.com/photo-1537565266751-34ddab005dd9?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 180px; object-fit: cover; border-radius: 10px;" />
             <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 180px; object-fit: cover; border-radius: 10px;" />
             <img src="https://images.unsplash.com/photo-1504280390227-6f851daee5bd?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 180px; object-fit: cover; border-radius: 10px; grid-column: span 2;" />
          </div>
        </div>
      </section>
      <section style="padding: 80px 20px; background: #e8f5e9; text-align: center;">
         <h2 style="font-family: 'Patrick Hand', cursive; font-size: 3.5rem; color: #2e7d32; margin-bottom: 20px;">Quy Định Khu Trại</h2>
         <p style="color: #388e3c; margin-bottom: 40px; font-size: 1.1rem; max-width: 800px; margin-left: auto; margin-right: auto;">Để giữ gìn không gian yên tĩnh và sạch sẽ chung, quý khách vui lòng không sử dụng loa kéo sau 10 giờ tối và thu gom rác thải đúng nơi quy định trước khi rời đi.</p>
      </section>
    </div>
  `,
  winter: `
    <div style="font-family: 'Montserrat', sans-serif; color: #1e293b; background-color: #f8fafc;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600;800&display=swap');
        .cj-ice-btn { background: rgba(255,255,255,0.9); color: #0284c7; padding: 15px 40px; border-radius: 30px; font-weight: 800; border: 2px solid #e0f2fe; box-shadow: 0 10px 20px rgba(2,132,199,0.1); transition: all 0.3s; }
        .cj-ice-btn:hover { background: #0284c7; color: white; border-color: #0284c7; }
        .cj-frost-card { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.5); padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
      </style>
      <section style="position: relative; height: 90vh; display: flex; align-items: center; justify-content: center; text-align: center;">
        <img src="https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, #f8fafc, rgba(248,250,252,0.3));"></div>
        <div style="position: relative; z-index: 10; padding: 20px;">
          <h1 style="font-size: 5rem; font-weight: 800; color: #0284c7; margin-bottom: 20px; text-shadow: 2px 2px 10px rgba(255,255,255,0.8);">Mùa Đông<br/>Kỳ Diệu</h1>
          <p style="font-size: 1.2rem; color: #334155; margin-bottom: 40px; font-weight: 600;">Trải nghiệm cái lạnh tuyệt đẹp, tuyết rơi trắng xóa và những cung đường sương mù giăng lối.</p>
          <a href="#" class="cj-ice-btn" style="display: inline-block; text-decoration: none;">Khám Phá Băng Tuyết</a>
        </div>
      </section>
      
      <section style="padding: 80px 20px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; position: relative; z-index: 20; margin-top: -100px;">
        <div class="cj-frost-card">
          <div style="font-size: 3rem; margin-bottom: 15px;">🌨️</div>
          <h3 style="font-size: 1.5rem; color: #0369a1; margin-bottom: 10px; font-weight: 800;">Săn Tuyết</h3>
          <p style="color: #475569;">Đón những bông tuyết đầu mùa trên những đỉnh núi cao nhất.</p>
        </div>
        <div class="cj-frost-card">
          <div style="font-size: 3rem; margin-bottom: 15px;">☕</div>
          <h3 style="font-size: 1.5rem; color: #0369a1; margin-bottom: 10px; font-weight: 800;">Góc Sưởi Ấm</h3>
          <p style="color: #475569;">Thưởng thức ly cà phê nóng hổi bên bếp lửa hồng.</p>
        </div>
        <div class="cj-frost-card">
          <div style="font-size: 3rem; margin-bottom: 15px;">🌲</div>
          <h3 style="font-size: 1.5rem; color: #0369a1; margin-bottom: 10px; font-weight: 800;">Rừng Thông</h3>
          <p style="color: #475569;">Dạo bước dưới những tán thông rợp bóng trong làn sương sớm.</p>
        </div>
      </section>

      <section style="padding: 80px 20px; background: #fff; text-align: center;">
        <h2 style="font-size: 2.5rem; font-weight: 800; color: #0284c7; margin-bottom: 50px;">Lịch Trình Đề Xuất</h2>
        <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; text-align: left;">
           <div style="background: #f0f9ff; padding: 30px; border-radius: 15px; display: flex; gap: 30px; align-items: center; border-left: 5px solid #38bdf8;">
             <h3 style="font-size: 2rem; color: #0284c7; font-weight: 900; margin: 0;">Ngày 1</h3>
             <div style="color: #334155;">Đón khách tại sân bay, di chuyển đến khách sạn nhận phòng. Buổi chiều dạo chơi thị trấn sương mù và thưởng thức lẩu cá hồi đặc sản.</div>
           </div>
           <div style="background: #f0f9ff; padding: 30px; border-radius: 15px; display: flex; gap: 30px; align-items: center; border-left: 5px solid #38bdf8;">
             <h3 style="font-size: 2rem; color: #0284c7; font-weight: 900; margin: 0;">Ngày 2</h3>
             <div style="color: #334155;">Chinh phục đỉnh núi cao nhất săn tuyết. Buổi chiều tự do tham quan bản làng và mua sắm đồ thổ cẩm.</div>
           </div>
        </div>
      </section>
      <section style="padding: 80px 20px; background: #0c4a6e; color: #fff; text-align: center;">
         <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 20px;">Khí Hậu Khắc Nghiệt</h2>
         <p style="color: #bae6fd; font-size: 1.1rem; margin-bottom: 40px; max-width: 800px; margin-left: auto; margin-right: auto;">Nhiệt độ vào mùa đông thường xuyên xuống dưới 0 độ C, đi kèm sương mù dày đặc và có thể có tuyết rơi. Cần chuẩn bị áo khoác dày, găng tay, mũ len và đặc biệt là giày đi tuyết chuyên dụng để chống trơn trượt.</p>
      </section>
    </div>
  `,
  river: `
    <div style="font-family: 'Quicksand', sans-serif; color: #166534; background-color: #f0fdf4;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
        .cj-leaf-shape { border-radius: 40px 10px 40px 10px; overflow: hidden; box-shadow: 0 15px 30px rgba(22,101,52,0.1); }
      </style>
      <section style="padding: 100px 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 50px; max-width: 1200px; margin: 0 auto;">
        <div style="flex: 1; min-width: 300px;">
          <span style="background: #dcfce7; color: #15803d; padding: 8px 20px; border-radius: 20px; font-weight: 700;">Hương Vị Đồng Quê</span>
          <h1 style="font-size: 4rem; font-weight: 700; margin: 20px 0; line-height: 1.2;">Miệt Vườn<br/>Sông Nước</h1>
          <p style="font-size: 1.2rem; color: #14532d; line-height: 1.8; margin-bottom: 30px;">Xuôi dòng kênh xanh mát, len lỏi qua những rặng dừa nước và thưởng thức trái cây chín mọng ngay tại vườn.</p>
          <div style="display: flex; gap: 20px;">
            <button style="background: #166534; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-weight: 700; font-size: 1.1rem;">Đi Thuyền</button>
            <button style="background: transparent; color: #166534; border: 2px solid #166534; padding: 12px 30px; border-radius: 25px; font-weight: 700; font-size: 1.1rem;">Khám Phá Vườn</button>
          </div>
        </div>
        <div style="flex: 1; min-width: 300px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <img class="cj-leaf-shape" src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 250px; object-fit: cover; transform: translateY(30px);" />
          <img class="cj-leaf-shape" src="https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 250px; object-fit: cover;" />
        </div>
      </section>
      
      <section style="padding: 80px 20px; background: #dcfce7; margin-top: 50px;">
        <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 40px;">Những Điều Bình Dị Nhất</h2>
          <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 30px;">
            <div style="text-align: center;">
              <div style="width: 120px; height: 120px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                <span style="font-size: 3rem;">🛶</span>
              </div>
              <h3 style="font-weight: 700; font-size: 1.3rem;">Chợ Nổi</h3>
            </div>
            <div style="text-align: center;">
              <div style="width: 120px; height: 120px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                <span style="font-size: 3rem;">🥥</span>
              </div>
              <h3 style="font-weight: 700; font-size: 1.3rem;">Trái Cây</h3>
            </div>
            <div style="text-align: center;">
              <div style="width: 120px; height: 120px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                <span style="font-size: 3rem;">🎶</span>
              </div>
              <h3 style="font-weight: 700; font-size: 1.3rem;">Đờn Ca</h3>
            </div>
          </div>
        </div>
      </section>
      
      <section style="padding: 80px 20px; background: #fff;">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 50px; align-items: center;">
          <div style="flex: 1; min-width: 300px;">
             <img class="cj-leaf-shape" src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 400px; object-fit: cover;" />
          </div>
          <div style="flex: 1; min-width: 300px;">
             <h2 style="font-size: 2.5rem; font-weight: 700; color: #166534; margin-bottom: 20px;">Nét Đẹp Chợ Nổi</h2>
             <p style="color: #14532d; line-height: 1.8; margin-bottom: 20px;">Khám phá văn hóa giao thương độc đáo trên sông nước. Thưởng thức tô bún riêu cua nóng hổi hay ly cà phê sữa đá đậm đà ngay trên chiếc ghe tròng trành.</p>
             <p style="color: #14532d; line-height: 1.8; margin-bottom: 30px;">Hàng trăm chiếc xuồng ba lá chở đầy nông sản đầy màu sắc tạo nên bức tranh quê hương sống động khó quên.</p>
             <a href="#" style="color: #166534; font-weight: 700; font-size: 1.1rem; text-decoration: none; border-bottom: 2px solid #166534; padding-bottom: 5px;">Xem Thêm Chi Tiết</a>
          </div>
        </div>
      </section>
      <section style="padding: 80px 20px; background: #14532d; color: #fff; text-align: center;">
         <h2 style="font-size: 3rem; font-weight: 700; margin-bottom: 20px;">Văn Hóa Ứng Xử Bản Địa</h2>
         <p style="color: #bbf7d0; font-size: 1.2rem; margin-bottom: 40px; max-width: 800px; margin-left: auto; margin-right: auto; line-height: 1.8;">Người dân miền sông nước vốn tính tình thật thà, chất phác và hiếu khách. Khi tham quan vườn trái cây hay mua bán trên chợ nổi, một nụ cười thân thiện và thái độ cởi mở sẽ giúp bạn nhanh chóng hòa nhập và được chào đón nhiệt tình.</p>
      </section>
    </div>
  `
};

const VisualBuilder = ({ initialData, onSave, title }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!editorRef.current) return;

    // Cấu hình dựa theo Role
    const isAdmin = user?.role === 'Admin';

    const editorInstance = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: 'calc(100vh - 64px)', // Trừ đi header
      width: 'auto',
      dragMode: 'translate', // Sử dụng chế độ translate mặc định để không làm vỡ layout (tránh position: absolute)
      storageManager: false, // Tắt storage nội bộ, tự lưu bằng API
      i18n: {
        locale: 'vi',
        localeFallback: 'en',
        messages: { vi: viLocale }
      },
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        gjsPresetWebpage: {
          // Các tùy chỉnh preset
          blocksBasicOpts: {
            flexGrid: true,
          },
          textGeneral: 'Chung',
          textLayout: 'Bố cục',
          textTypography: 'Kiểu chữ',
          textDecorations: 'Trang trí',
          textExtra: 'Mở rộng',
          textFlex: 'Bố cục Flex',
          textDimension: 'Kích thước'
        }
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ]
      },
      // Nếu là Editor, ẩn một số công cụ nâng cao (như xem code nguồn)
      panels: {
        defaults: [
          {
            id: 'panel-top',
            el: '.panel__top',
          },
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true, // bật đường viền canvas
                className: 'btn-toggle-borders',
                label: '<u>B</u>',
                command: 'sw-visibility',
              },
              ...(isAdmin ? [
                {
                  id: 'export',
                  className: 'btn-open-export',
                  label: '</>',
                  command: 'export-template',
                  context: 'export-template', // Export code chỉ dành cho Admin
                }
              ] : [])
            ],
          }
        ]
      }
    });

    // Load dữ liệu cũ nếu có
    if (initialData) {
      // ContentJson thường lưu cả components và styles
      try {
        const data = JSON.parse(initialData);
        editorInstance.setComponents(data.components);
        editorInstance.setStyle(data.styles);
      } catch (e) {
        // Nếu không phải JSON hợp lệ (ví dụ chuỗi HTML cũ)
        editorInstance.setComponents(initialData);
      }
    } else {
      // Dữ liệu mẫu trống -> Thay bằng một Landing Page Template Hoàn Chỉnh cực đẹp
      editorInstance.setComponents(TEMPLATES.beach);
    }

    // Bật tính năng cho phép Kéo giãn (Resize) mọi thành phần khi được chọn
    editorInstance.on('component:selected', (model) => {
       if (!model.get('resizable')) {
           model.set('resizable', true);
       }
    });

    editorInstance.on('load', () => {
      // Fix fonts in existing CSS rules
      try {
        const cssRules = editorInstance.Css ? editorInstance.Css.getAll() : (editorInstance.CssComposer ? editorInstance.CssComposer.getAll() : []);
        cssRules.forEach(rule => {
          const style = rule.getStyle();
          let changed = false;
          if (style['font-family']) {
            if (style['font-family'].includes('Pacifico')) {
              style['font-family'] = style['font-family'].replace('Pacifico', 'Dancing Script');
              changed = true;
            }
            if (style['font-family'].includes('Cinzel')) {
              style['font-family'] = style['font-family'].replace('Cinzel', 'Playfair Display');
              changed = true;
            }
            if (style['font-family'].includes('Poppins')) {
              style['font-family'] = style['font-family'].replace('Poppins', 'Be Vietnam Pro');
              changed = true;
            }
            if (style['font-family'].includes('Oswald')) {
              style['font-family'] = style['font-family'].replace('Oswald', 'Roboto Condensed');
              changed = true;
            }
            if (style['font-family'].includes('Caveat')) {
              style['font-family'] = style['font-family'].replace('Caveat', 'Patrick Hand');
              changed = true;
            }
            if (style['font-family'].includes('Impact')) {
              style['font-family'] = style['font-family'].replace('Impact', 'Anton');
              changed = true;
            }
            if (style['font-family'].includes('Arial Black')) {
              style['font-family'] = style['font-family'].replace('Arial Black', 'Inter');
              changed = true;
            }
            if (style['font-family'].includes('Comic Sans MS')) {
              style['font-family'] = style['font-family'].replace('Comic Sans MS', 'Patrick Hand');
              changed = true;
            }
            if (style['font-family'].includes('Brush Script MT')) {
              style['font-family'] = style['font-family'].replace('Brush Script MT', 'Dancing Script');
              changed = true;
            }
            if (style['font-family'].includes('Roboto') && !style['font-family'].includes('Condensed')) {
              style['font-family'] = style['font-family'].replace('Roboto', 'Inter');
              changed = true;
            }
          }
          if (changed) {
            rule.setStyle(style);
          }
        });
      } catch (e) { console.error("Error fixing fonts in CSS rules:", e); }

      // Auto-fix legacy fonts (Pacifico, Cinzel, Poppins, Impact, Roboto, Arial Black, etc.) in existing canvas data
      const doc = editorInstance.Canvas.getDocument();
      if (doc && !doc.getElementById('legacy-font-fix')) {
        const style = doc.createElement('style');
        style.id = 'legacy-font-fix';
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;600;800&family=Roboto+Condensed:wght@400;700&family=Patrick+Hand&family=Anton&family=Inter:wght@300;400;500;700;900&display=swap');
          [style*="Pacifico"], .cj-food-title { font-family: 'Dancing Script', cursive !important; }
          [style*="Cinzel"] { font-family: 'Playfair Display', serif !important; }
          [style*="Poppins"] { font-family: 'Be Vietnam Pro', sans-serif !important; }
          [style*="Oswald"] { font-family: 'Roboto Condensed', sans-serif !important; }
          [style*="Caveat"] { font-family: 'Patrick Hand', cursive !important; }
          [style*="Impact"], font[face*="Impact"] { font-family: 'Anton', sans-serif !important; letter-spacing: 1px; }
          [style*="Arial Black"], font[face*="Arial Black"] { font-family: 'Inter', sans-serif !important; font-weight: 900 !important; }
          [style*="Comic Sans MS"], font[face*="Comic Sans MS"] { font-family: 'Patrick Hand', cursive !important; }
          [style*="Brush Script MT"], font[face*="Brush Script MT"] { font-family: 'Dancing Script', cursive !important; }
          [style*="Roboto"]:not([style*="Condensed"]), .cj-neon { font-family: 'Inter', sans-serif !important; }
        `;
        doc.head.appendChild(style);
      }

      // Tự động thêm Khối Hình ảnh (Image) vào mục Cơ bản
      const bm = editorInstance.BlockManager;
      bm.add('custom-image', {
        label: `
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" />
          </svg>
          <div class="gjs-block-label">Hình ảnh</div>
        `,
        category: 'Cơ bản',
        content: { type: 'image' }
      });
      
      bm.add('custom-text', {
        label: `
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,7.36 17.26,7.26C16.69,7.11 16.08,7.07 15.24,7.07H14V16.6C14,17.46 14.08,18 14.23,18.2C14.38,18.41 14.74,18.5 15.35,18.5H16.09V19.41H8V18.5H8.7C9.35,18.5 9.72,18.41 9.87,18.2C10.03,18 10.1,17.43 10.1,16.6V7.07H8.83C7.96,7.07 7.33,7.13 6.85,7.26C6.3,7.36 5.83,7.74 5.39,8.61L4.42,8.35L5.58,4H18.5Z" />
          </svg>
          <div class="gjs-block-label">Chữ tự do</div>
        `,
        category: 'Cơ bản',
        content: { 
          type: 'text', 
          content: 'Nhấp đúp để sửa chữ', 
          style: { padding: '10px' }
        }
      });

      // Thêm Form liên hệ với CSS đặc chế từ "góp ý"
      bm.add('custom-contact-form', {
        label: `
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z" />
          </svg>
          <div class="gjs-block-label">Form Liên Hệ</div>
        `,
        category: 'Nâng cao',
        content: `
<style>
  .custom-form-wrapper {
    max-width: 500px; margin: 20px auto; padding: 30px;
    background: #ffffff; border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    font-family: 'Inter', sans-serif;
  }
  .form-group { margin-bottom: 20px; }
  .form-label { display: block; margin-bottom: 8px; font-weight: 600; color: #374151; font-size: 14px; }
  .form-input {
    width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px;
    font-size: 14px; transition: all 0.3s ease; box-sizing: border-box;
  }
  .form-input:focus { outline: none; border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1); }
  .form-input:not(:placeholder-shown):invalid { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
  .error-message { display: none; color: #ef4444; font-size: 12px; margin-top: 5px; }
  .form-input:not(:placeholder-shown):invalid ~ .error-message { display: block; }
  
  /* Select Wrapper theo góp ý */
  .select-wrapper {
    position: relative; width: 100%; background-color: #f9fafb;
    border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden; transition: border-color 0.3s ease;
  }
  .select-wrapper:focus-within { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1); }
  .select-wrapper::after {
    content: '▼'; position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%); pointer-events: none; font-size: 12px; color: #6b7280;
  }
  .form-select {
    width: 100%; padding: 12px 40px 12px 16px; border: none; background: transparent;
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    font-size: 14px; color: #374151; cursor: pointer;
  }
  .form-select:focus { outline: none; }
  
  /* Captcha theo góp ý */
  .captcha-container {
    display: flex; align-items: center; padding: 15px; background: #f9fafb;
    border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;
  }
  .captcha-checkbox { width: 24px; height: 24px; cursor: pointer; accent-color: #0d9488; }
  .captcha-text { margin-left: 10px; font-size: 14px; color: #4b5563; font-weight: 500; }
  .captcha-logo { margin-left: auto; font-size: 18px; color: #9ca3af; }
  
  .submit-btn {
    width: 100%; padding: 14px; background-color: #0d9488; color: white;
    border: none; border-radius: 8px; font-weight: 600; font-size: 16px;
    cursor: pointer; transition: all 0.3s ease;
  }
  .submit-btn:hover { background-color: #0f766e; }
  .submit-btn:active { transform: scale(0.98); }
</style>
<div class="custom-form-wrapper">
  <h3 style="margin-top: 0; margin-bottom: 20px; color: #111827; font-size: 24px;">Liên hệ với chúng tôi</h3>
  <form>
    <div class="form-group">
      <label class="form-label">Họ và tên</label>
      <input type="text" class="form-input" placeholder="Nhập họ và tên..." required pattern=".{2,}" />
      <div class="error-message">Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự).</div>
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" class="form-input" placeholder="Ví dụ: email@domain.com" required />
      <div class="error-message">Email không đúng định dạng.</div>
    </div>
    <div class="form-group">
      <label class="form-label">Vấn đề cần hỗ trợ</label>
      <div class="select-wrapper">
        <select class="form-select" required>
          <option value="" disabled selected>-- Chọn chủ đề --</option>
          <option value="tour">Tư vấn đặt Tour</option>
          <option value="hotel">Phòng khách sạn</option>
          <option value="other">Góp ý khác</option>
        </select>
      </div>
    </div>
    <div class="captcha-container">
      <input type="checkbox" id="captcha" class="captcha-checkbox" required />
      <label for="captcha" class="captcha-text">Tôi là con người</label>
      <span class="captcha-logo">✅</span>
    </div>
    <button type="submit" class="submit-btn">Gửi yêu cầu</button>
  </form>
</div>
        `
      });

      // --- (Bỏ CÁC BỘ KHUNG GIAO DIỆN THEO CHỦ ĐỀ khỏi BlockManager vì đã có nút Chọn Mẫu) ---

      // 1. Dịch tooltips cho Rich Text Editor (RTE)
      const rte = editorInstance.RichTextEditor;
      const actions = rte.getAll();
      const rteDict = {
        bold: 'In đậm (Ctrl+B)',
        italic: 'In nghiêng (Ctrl+I)',
        underline: 'Gạch chân (Ctrl+U)',
        strikethrough: 'Gạch ngang',
        link: 'Chèn liên kết',
        wrap: 'Bọc đoạn văn'
      };
      
      actions.forEach(action => {
        if (rteDict[action.name]) {
          action.attributes = action.attributes || {};
          action.attributes.title = rteDict[action.name];
        }
      });
      
      // 2. Ép dịch toàn bộ thanh StyleManager (Cột bên phải)
      const sm = editorInstance.StyleManager;
      const translateDict = {
        // Tên nhóm (Sectors)
        'General': 'Chung',
        'Dimension': 'Kích thước',
        'Typography': 'Kiểu chữ',
        'Decorations': 'Trang trí',
        'Extra': 'Mở rộng',
        'Flex': 'Bố cục Flex',
        
        // Thuộc tính (Properties)
        'Display': 'Hiển thị',
        'Float': 'Căn lề (Float)',
        'Position': 'Vị trí',
        'Top': 'Trên',
        'Right': 'Phải',
        'Bottom': 'Dưới',
        'Left': 'Trái',
        'Width': 'Chiều rộng',
        'Height': 'Chiều cao',
        'Max width': 'Rộng tối đa',
        'Min height': 'Cao tối thiểu',
        'Margin': 'Lề ngoài (Margin)',
        'Padding': 'Lề trong (Padding)',
        'Font family': 'Phông chữ',
        'Font size': 'Cỡ chữ',
        'Font weight': 'Độ dày chữ',
        'Letter spacing': 'Khoảng cách chữ',
        'Color': 'Màu sắc',
        'Line height': 'Chiều cao dòng',
        'Text align': 'Căn chữ',
        'Text shadow': 'Bóng chữ',
        'Opacity': 'Độ mờ',
        'Background color': 'Màu nền',
        'Border radius': 'Bo góc',
        'Border': 'Viền',
        'Box shadow': 'Bóng khối',
        'Background': 'Nền',
        'Transition': 'Hiệu ứng chuyển',
        'Perspective': 'Phối cảnh',
        'Transform': 'Biến đổi',
        'Flex direction': 'Hướng Flex',
        'Flex wrap': 'Xuống dòng',
        'Justify content': 'Căn ngang',
        'Align items': 'Căn dọc',
        'Align content': 'Căn khối dọc',
        'Align self': 'Căn cá nhân'
      };

      sm.getSectors().forEach(sector => {
          const sectorName = sector.get('name');
          if (translateDict[sectorName]) sector.set('name', translateDict[sectorName]);
          
          sector.get('properties').forEach(prop => {
              const propName = prop.get('name');
              if (translateDict[propName]) prop.set('name', translateDict[propName]);
              
              // Dịch các thuộc tính con (Nested/Composite properties)
              if (prop.get('properties')) {
                  prop.get('properties').forEach(subProp => {
                      const subName = subProp.get('name');
                      // Width dùng chung, nạp thêm từ điển phụ nếu cần, hoặc quét qua translateDict
                      const nestedDict = {
                          'Top Left': 'Góc trên trái', 'Top Right': 'Góc trên phải', 
                          'Bottom Left': 'Góc dưới trái', 'Bottom Right': 'Góc dưới phải',
                          'Width': 'Độ dày', 'Style': 'Kiểu viền', 'Color': 'Màu sắc',
                          'X': 'Ngang', 'Y': 'Dọc', 'Blur': 'Mờ', 'Spread': 'Lan rộng', 'Type': 'Loại'
                      };
                      if (nestedDict[subName]) subProp.set('name', nestedDict[subName]);
                      else if (translateDict[subName]) subProp.set('name', translateDict[subName]);
                  });
              }
          });
      });

      // Bạo chúa: Dùng DOM MutationObserver để ép dịch những chữ cứng đầu (Classes, States, Sector titles)
      const forceTranslateDOM = () => {
          const domDict = {
              'General': 'Chung',
              'Dimension': 'Kích thước',
              'Typography': 'Kiểu chữ',
              'Decorations': 'Trang trí',
              'Extra': 'Mở rộng',
              'Flex': 'Bố cục Flex',
              'Classes': 'Lớp (Classes)',
              '- State -': '- Trạng thái -',
              'Hover': 'Khi trỏ chuột',
              'Click': 'Khi click',
              'Even/Odd': 'Chẵn/Lẻ',
              'Width': 'Độ dày', // Đôi lúc DOM hiển thị
              'Style': 'Kiểu viền',
              'Color': 'Màu sắc',
              'Top Left': 'Góc trên trái',
              'Top Right': 'Góc trên phải',
              'Bottom Left': 'Góc dưới trái',
              'Bottom Right': 'Góc dưới phải',
              'Component settings': 'Cài đặt thành phần',
              'Id': 'Định danh (Id)',
              'Title': 'Tiêu đề',
              'Body': 'Phần thân',
              'Text': 'Văn bản',
              'Image': 'Hình ảnh',
              'Link': 'Liên kết',
              'Box': 'Khối',
              'Video': 'Video',
              'Map': 'Bản đồ',
              'Table': 'Bảng',
              'Row': 'Hàng',
              'Cell': 'Ô',
              'Select an element before using Style Manager': 'Chọn 1 phần tử trước để chỉnh sửa',
              'Select an element before using Trait Manager': 'Chọn 1 phần tử trước để cài đặt',
              'No layers found': 'Chưa có lớp nào',
              'Basic': 'Cơ bản',
              'Forms': 'Biểu mẫu',
              'Link Block': 'Khối liên kết',
              'Quote': 'Trích dẫn',
              'Text section': 'Đoạn văn bản',
              '1 Column': '1 Cột',
              '2 Columns': '2 Cột',
              '3 Columns': '3 Cột',
              '3/7 Columns': 'Cột 3/7'
          };
          
          const rightPanel = document.querySelector('.gjs-pn-views-container');
          if (!rightPanel) return;
          
          const walk = document.createTreeWalker(rightPanel, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while(node = walk.nextNode()) {
              const val = node.nodeValue.trim();
              if (domDict[val]) {
                  node.nodeValue = node.nodeValue.replace(val, domDict[val]);
              }
          }
      };

      // Chạy dịch lần đầu
      setTimeout(forceTranslateDOM, 100);

      // Quan sát sự thay đổi DOM ở cột bên phải để dịch real-time (khi đổi state, component)
      const rightPanel = document.querySelector('.gjs-pn-views-container');
      if (rightPanel) {
          const observer = new MutationObserver(() => {
              forceTranslateDOM();
          });
          observer.observe(rightPanel, { childList: true, subtree: true, characterData: true });
      }

      // 3. Dịch tooltip cho các nút trên thanh Menu (Panels)
      const pn = editorInstance.Panels;
      const panelButtonsDict = {
          'sw-visibility': 'Hiển thị viền',
          'preview': 'Xem trước',
          'fullscreen': 'Toàn màn hình',
          'export-template': 'Xem mã nguồn',
          'undo': 'Hoàn tác (Ctrl+Z)',
          'redo': 'Làm lại (Ctrl+Y)',
          'gjs-open-import-webpage': 'Nhập mã (Import)',
          'canvas-clear': 'Xóa toàn bộ trang'
      };
      
      pn.getPanels().forEach(panel => {
          panel.get('buttons').forEach(btn => {
              const cmd = btn.get('command');
              const id = btn.get('id');
              const matchedTooltip = panelButtonsDict[cmd] || panelButtonsDict[id];
              if (matchedTooltip) {
                  btn.set('attributes', { ...btn.get('attributes'), title: matchedTooltip });
              }
          });
      });
      
      // 4. Thay thế lệnh Xóa canvas mặc định bằng SweetAlert2
      editorInstance.Commands.add('canvas-clear', () => {
        confirmAction('Xóa toàn bộ?', 'Bạn có chắc chắn muốn xóa sạch toàn bộ thiết kế hiện tại không?', 'Xóa ngay').then(isConfirmed => {
          if (isConfirmed) {
            editorInstance.DomComponents.clear();
            editorInstance.CssComposer.clear();
            showToast("Đã xóa thiết kế", "success");
          }
        });
      });
      
      // Khởi chạy lại render để nhận chữ mới
      const wrapper = editorInstance.getWrapper();
      editorInstance.select(wrapper);
      setTimeout(() => editorInstance.select(null), 50);
    });

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, [user]);

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    
    // Lấy JSON Data (mạnh nhất, lưu lại đầy đủ thuộc tính CSS)
    const components = editor.getComponents();
    const styles = editor.getStyle();
    
    const contentJson = JSON.stringify({
      components: JSON.parse(JSON.stringify(components)),
      styles: JSON.parse(JSON.stringify(styles))
    });

    // Cũng lấy cả HTML/CSS để Render ngoài frontend (cho Traveler xem)
    const html = editor.getHtml();
    const css = editor.getCss();

    await onSave({ contentJson, html, css });
    
    setIsSaving(false);
  };

  const handleApplyTemplate = async (themeKey) => {
    if (!editor) {
      showToast("Lỗi: Không tìm thấy Editor!", "error");
      return;
    }
    
    // Sử dụng SweetAlert2 của hệ thống thay vì window.confirm
    const isConfirmed = await confirmAction('Ghi đè thiết kế?', 'Áp dụng bộ khung mới sẽ xóa thiết kế hiện tại. Bạn có chắc chắn không?', 'Có, áp dụng ngay!');
    
    if (isConfirmed) {
      try {
        editor.setComponents(TEMPLATES[themeKey]);
        setShowTemplateModal(false);
        showToast("Đã áp dụng khung giao diện thành công!", "success");
      } catch (err) {
        showToast("Lỗi khi áp dụng: " + err.message, "error");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Nút Chọn Mẫu Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutTemplate className="w-6 h-6 text-primary" />
                Chọn Nhanh Bộ Khung Giao Diện
              </h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div 
                onClick={() => handleApplyTemplate('beach')}
                className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-cyan-500 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-cyan-100 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Beach" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Biển Đảo</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu xanh ngọc tươi mát, bố cục thoáng đãng. Phù hợp cho du lịch nghỉ dưỡng, lặn biển.</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyTemplate('beach'); }}
                    className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors"
                  >
                    Áp dụng mẫu này
                  </button>
                </div>
              </div>
              
              {/* Card 2 */}
              <div 
                onClick={() => handleApplyTemplate('mountain')}
                className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-green-600 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-green-100 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Mountain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Núi Rừng</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu xanh lá tự nhiên, hoang dã. Thích hợp với các tour trekking, cắm trại, khám phá thiên nhiên.</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyTemplate('mountain'); }}
                    className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors"
                  >
                    Áp dụng mẫu này
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div 
                onClick={() => handleApplyTemplate('heritage')}
                className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-amber-700 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-amber-100 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Heritage" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Di Tích</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu nâu trầm, vàng cổ kính. Dành cho các tour du lịch văn hóa, tìm hiểu lịch sử, di sản.</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyTemplate('heritage'); }}
                    className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-amber-700 group-hover:text-white transition-colors"
                  >
                    Áp dụng mẫu này
                  </button>
                </div>
              </div>

              {/* Card 4 - City */}
              <div 
                onClick={() => handleApplyTemplate('city')}
                className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-indigo-600 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-indigo-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="City" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Đô Thị Phồn Hoa</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Giao diện Dark Mode hiện đại, hiệu ứng kính (Glassmorphism). Dành cho các thành phố lớn, giải trí về đêm.</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyTemplate('city'); }}
                    className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                  >
                    Áp dụng mẫu này
                  </button>
                </div>
              </div>

              {/* Card 5 - Nature */}
              <div 
                onClick={() => handleApplyTemplate('nature')}
                className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-pink-500 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-pink-100 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Nature" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Thơ Mộng</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu pastel nhẹ nhàng, lãng mạn. Phù hợp cho các điểm đến như Đà Lạt, các thung lũng hoa.</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyTemplate('nature'); }}
                    className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-pink-500 group-hover:text-white transition-colors"
                  >
                    Áp dụng mẫu này
                  </button>
                </div>
              </div>

              {/* Card 6 - Adventure */}
              <div onClick={() => handleApplyTemplate('adventure')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-orange-500 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-orange-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Adventure" />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Mạo Hiểm</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Năng động, đậm chất thể thao. Thích hợp cho các tour leo núi, thám hiểm hang động, trekking.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('adventure'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>

              {/* Card 7 - Resort */}
              <div onClick={() => handleApplyTemplate('resort')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-yellow-600 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-yellow-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Resort" />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Nghỉ Dưỡng</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Sang trọng, thanh lịch với tông màu trắng vàng. Phù hợp cho resort 5 sao, du thuyền cao cấp.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('resort'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-yellow-600 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>

              {/* Card 8 - Food */}
              <div onClick={() => handleApplyTemplate('food')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-rose-600 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-rose-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Food" />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Ẩm Thực</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu đỏ ấm áp kích thích vị giác. Phù hợp cho Food tour, điểm đến văn hóa ẩm thực.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('food'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>

              {/* Card 9 - Festival */}
              <div onClick={() => handleApplyTemplate('festival')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-teal-600 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-teal-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Festival" />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Lễ Hội</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Rực rỡ, náo nhiệt với nhiều màu sắc. Dành cho các tour tham gia lễ hội truyền thống, sự kiện.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('festival'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>

              {/* Card 10 - Camping */}
              <div onClick={() => handleApplyTemplate('camping')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-green-700 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-green-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Camping" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Cắm Trại</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Mộc mạc, gần gũi thiên nhiên. Phù hợp cho Glamping, cắm trại rừng thông, săn mây.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('camping'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-green-700 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>

              {/* Card 11 - Winter */}
              <div onClick={() => handleApplyTemplate('winter')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-sky-500 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-sky-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Winter" />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Mùa Đông</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu trắng xanh lạnh giá, hiệu ứng băng tuyết. Dành cho Sapa mùa đông, du lịch hàn đới.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('winter'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>

              {/* Card 12 - River */}
              <div onClick={() => handleApplyTemplate('river')} className="group cursor-pointer rounded-xl border-2 border-gray-100 hover:border-emerald-600 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="h-40 bg-emerald-900 flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="River" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-lg">Miệt Vườn</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <p className="text-sm text-gray-500 mb-4 flex-1">Tông màu xanh lá cây mát mẻ. Phù hợp cho du lịch miền Tây sông nước, du lịch miệt vườn, trái cây.</p>
                  <button onClick={(e) => { e.stopPropagation(); handleApplyTemplate('river'); }} className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">Áp dụng mẫu này</button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Builder Custom Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-surface shadow-sm z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{title || 'Trình thiết kế Giao diện'}</h1>
            <p className="text-xs text-gray-500">Chế độ: {user?.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Chọn Giao Diện Mẫu
          </button>
          
          <div className="panel__basic-actions ml-2 border-l pl-4 border-gray-200"></div> {/* Nơi GrapesJS gắn nút Export/Border */}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Đang lưu...' : 'Lưu Thiết Kế'}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative">
        <div ref={editorRef} className="absolute inset-0"></div>
      </div>
    </div>
  );
};

export default VisualBuilder;
