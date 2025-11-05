[phases]
setup = "curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs npm"
install = "npm install"
build = "npm run build"

[start]
command = "npm start"