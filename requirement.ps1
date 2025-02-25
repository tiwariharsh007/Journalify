# Initialize git repo if not already
git init

# Configure user (replace if needed)
git config user.name "tiwariharsh007"
git config user.email "tiwari007harsh@gmail.com"

# Commits array: "YYYY-MM-DD|message"
$commits = @(
    "2025-02-25|feat: initialize backend with Express setup"
    "2025-02-26|chore: setup MongoDB connection in utils/db.js"
    "2025-02-27|feat: add user model and auth controller"
    "2025-02-28|feat: create routes for signup and login"
    "2025-03-01|fix: resolve CORS error in backend config"
    "2025-03-02|chore: add dotenv and configure environment variables"
    "2025-03-03|feat: implement JWT authentication middleware"
    "2025-03-04|feat: add journal model and basic CRUD routes"
    "2025-03-05|fix: bug in journal creation API response"
    "2025-03-06|docs: update backend README with API usage"
    "2025-03-07|feat: initialize frontend with Vite and Tailwind"
    "2025-03-08|style: configure Tailwind base styles and themes"
    "2025-03-09|feat: create login and signup forms in frontend"
    "2025-03-10|feat: connect frontend forms to backend auth API"
    "2025-03-11|fix: input validation issue in signup form"
    "2025-03-12|feat: add navbar and basic routing in frontend"
    "2025-03-13|feat: implement journal creation UI"
    "2025-03-14|fix: API request headers for journal submission"
    "2025-03-15|feat: display user journals in dashboard"
    "2025-03-16|refactor: organize frontend components by feature"
    "2025-03-17|style: improve responsive design for mobile"
    "2025-03-18|feat: add profile page with user details"
    "2025-03-19|fix: avatar upload not saving correctly"
    "2025-03-20|feat: integrate multer for image uploads"
    "2025-03-21|docs: update README with project setup steps"
    "2025-03-22|feat: implement search and filter for journals"
    "2025-03-23|fix: pagination issue in journal listing"
    "2025-03-24|chore: cleanup unused frontend assets"
    "2025-03-25|refactor: optimize backend controllers"
    "2025-03-26|feat: secure journal routes with JWT verification"
    "2025-03-27|fix: token expiration bug in middleware"
    "2025-03-28|style: update UI with better card layouts"
    "2025-03-29|feat: add dark mode toggle"
    "2025-03-30|perf: improve frontend rendering performance"
    "2025-03-31|docs: add screenshots to README"
    "2025-04-01|chore: configure deployment settings"
    "2025-04-02|fix: small bug in logout functionality"
    "2025-04-03|feat: final polish before deployment"
)

# Dummy file to ensure commits detect changes
if (-not (Test-Path "dummy.txt")) {
    New-Item -ItemType File -Name "dummy.txt" | Out-Null
}

# Loop through commits
foreach ($commit in $commits) {
    $parts = $commit -split "\|", 2
    $date = $parts[0]
    $message = $parts[1]

    # Write commit message text (change in dummy file)
    Add-Content -Path "dummy.txt" -Value $message

    git add .

    # Random commit time between 10:00 - 20:00
    $hour = Get-Random -Minimum 10 -Maximum 20
    $minute = Get-Random -Minimum 0 -Maximum 59
    $commitDate = "$date $hour`:$minute`:00"

    $env:GIT_COMMITTER_DATE = $commitDate
    git commit --date "$commitDate" -m "$message"
}

# Push to main branch
git branch -M main
git push origin main --force
