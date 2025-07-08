<h1 align="center">
Eco Stories
</h1>
<p align="center">
  <img src="assets/maskIcon.png" alt="Mask" width="250"/>
</p>
<div align="center">
  <!-- Line 1 -->
  <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TYPESCRIPT">
  <img src="https://img.shields.io/badge/NODE-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="NODE">
  <img src="https://img.shields.io/badge/EXPRESS-%20-FF6F61?style=for-the-badge&logo=express&logoColor=white&label=EXPRESS&labelColor=FF6F61" alt="EXPRESS">
  <br>
  <!-- Line 2 -->
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/-Knex-D26B38?style=for-the-badge&logo=knexdotjs&logoColor=white" alt="Knex">
  <br>
  <!-- Line 3 -->
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose">
  <p align="center">
    <a href="https://www.labemunisul.com.br/swagger.html">
      <img src="https://img.shields.io/badge/SWAGGER-DOCS-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="SWAGGER">
    </a>
    <a href="./EnglishREADME.md">
      <img src="https://img.shields.io/badge/README-EN-blue?style=for-the-badge" alt="README EN">
    </a>
  </p>
</div>

<h2>Project Purpose</h2> 
<p>
Eco aims to develop a minimalist mobile and web platform for anonymous story sharing, prioritizing privacy, emotional comfort, and simple navigation. Anonymity is guaranteed by nicknames and fixed avatars—no real names or customizable profiles—using email authentication only for basic moderation, with no external integrations. Each post (“Eco”) has limited comments and is categorized by sensitive tags, avoiding gamification and excessive exposure. The architecture uses React Native and React on the frontend (private repositories due to backend focus), while the API is built with Node.js, Express, and PostgreSQL, with avatar storage on AWS S3 and automated deployment via Docker. All development follows security, modularity, and privacy-respecting principles, with clear Swagger documentation, automated tests via Vitest, and Knex Query Builder for database operations. This is a backend-focused project; I will not detail the frontend development here.
</p>
<p>
  To learn more about the project philosophy, check out the article published on
  <a href="https://medium.com/@pedrojson/programei-uma-rede-social-do-zero-e-vou-te-mostrar-como-ela-funciona-689b8f558f33" target="_blank">Medium</a>.
</p>

<hr/>

<h2>Docs</h2>
<img src="assets/swaggerEco.png" alt="API Swagger" style="max-width: 500px; width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 16px;" />
<p>
  Access the documentation at:<br>
  <a href="https://api.ecohistorias.com.br/docs/" target="_blank">Swagger</a>
</p>
<p>
  <strong>Note:</strong> The routes for listing users and posting Ecos have been removed from the production branch! They were only used for debugging and tests. They are not documented in Swagger as they are not official, but they remain available in the development branch (<code>main</code>).
</p>

<h2>Authentication & Security</h2>
<p>
  <code>JWT</code> authentication uses <strong>httpOnly cookies</strong> to store the session token, increasing security against XSS attacks. The backend uses the <code>cookie-parser</code> middleware to read cookies in protected routes, while the frontend is adapted to avoid direct token handling, employing <code>credentials: 'include'</code> in all authenticated requests. Sensitive variables are managed via <code>dotenv</code> and passwords are always stored hashed with <code>bcrypt</code>. <code>CORS</code> is enabled for frontend/backend integration with strict origin control.
</p>
<p>
  Additionally, the API uses <code>helmet</code> to enhance HTTP security headers, <code>rate limiting</code> to limit requests and prevent abuse/brute force, and <code>zod</code> for robust input validation on all public and protected routes.
</p>

<img src="assets/corsEco.png" alt="Secure CORS configuration in backend" width="700" height="auto" style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.10);" />

<h2>Database</h2>
<p>
  The project database is structured in <code>PostgreSQL</code> with relational modeling. Database access and query building are done using the <code>Knex Query Builder</code>, which facilitates maintenance, migrations, and standardization of SQL operations. During development, I used <code>pgAdmin</code> for local management, but in the production branch, I opted for <strong>Neon</strong> as a cloud PostgreSQL solution, ensuring high availability, automatic backups, and efficient backend integration.
</p>
<img src="assets/schemasEco.png" alt="Database schemas" width="700" height="auto" style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.10);" />

<h2>Testing</h2>
<p>
  API automated tests are implemented with <code>Vitest</code>, providing efficient coverage of routes, services, and middlewares, with fast execution and integration into the development workflow. The entire backend is developed in <code>TypeScript</code>, ensuring static typing, better code organization, and reduced bugs during development and maintenance.
</p>

<h2>Docker</h2>
<p>
  The project uses <code>Docker Compose</code> to orchestrate all essential services, making it easy to set up and run the local environment with just one command. The PostgreSQL database, backend, migration and seed scripts, environment variables, and Swagger documentation are all pre-configured, speeding up setup for development and testing. The use of containers also simplifies continuous deployment on the Render platform.
</p>

<h2>Important: Cookies, CORS and Domains</h2>
<p>
  To ensure secure authentication via httpOnly cookies, the frontend and backend <strong>must be on the same root domain</strong> (e.g.: <code>ecohistorias.com.br</code> and <code>api.ecohistorias.com.br</code>). This is because browsers only send cookies automatically to the same domain or configured subdomains.<br>
  If the backend is hosted on a different domain (e.g.: <code>eco.onrender.com</code>), the authentication cookie <strong>will not be sent</strong> in frontend requests, even if the backend tries to set the cookie.<br>
  For this reason, in production, I use subdomains of the same main domain and configure the cookie as follows:
</p>

```js
domain: '.ecohistorias.com.br',
sameSite: 'lax',
secure: true
```
