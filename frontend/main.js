(() => {
    const sock = io();

    sock.on("set-cookie", (cookie) => {
        document.cookie = cookie;  // Set Cookie in client-site
        console.log("Cookie", cookie);
    });

    sock.on("message", (t) => {
        console.log("message: ", t);
    });

    sock.on("set_sid", (f, sid) => {
        console.log(f, sid);
        if(f == true){
            document.querySelector("#progress_0").style.display = "none";
            document.querySelector("#progress_1").style.display = "block";

            document.querySelector("#title").innerHTML += ", "+sid;
        }
    })

    document
        .querySelector("#clicker")
        .addEventListener("click", (e) => {
            sock.emit("counter");
        });

    document
        .querySelector("#form_set_sid")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            sock.emit("set_sid", document.querySelector("#sid").value)
        })
})();