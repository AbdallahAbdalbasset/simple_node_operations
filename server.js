const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const hostname = '127.0.0.1'
const port = 3000

let users = []

function generateUsersTable(users) {
    if (users.length === 0) {
        return "<p>No users submitted yet.</p>";
    }

    let table = `
        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach((user, index) => {
        table += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.age}</td>
            </tr>
        `;
    });

    table += `
            </tbody>
        </table>
    `;

    return table;
}


const server = http.createServer((req, res) => {

    if(req.method == "GET" && req.url == "/"){
        fs.readFile("index.html", (err, data) => {
            if(err) console.log("error rading the html file")
            else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/html')
                res.end(data)
            }
        })
    }

    else if(req.method == "POST" && req.url == "/"){
        let body = ''
        req.on('data', (chunk) => {body += chunk.toString()})
        req.on('end', ()=> {
            const formData = querystring.parse(body)
            users.push(formData)
            console.log(users)

            fs.readFile("success.html", (err, data) => {
                if(err) console.log("Error reading success.html file");
                else{
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    res.end(data);
                }
            })
        })
    }

    else if(req.method == "GET" && req.url == "/show"){
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        const tableHtml = generateUsersTable(users);
        const page = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Users List</title>
                </head>
                <body>
                    <h1>All Submitted Users</h1>
                    ${tableHtml}
                    <a href="/"> <button> Back </button> </a>
                </body>
            </html>
        `;

        res.end(page);
    }
    else {
        console.log("Error 404 !")
    }
    
})

server.listen(port, hostname, ()=> {
    console.log("Running")
})



