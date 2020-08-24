var divResult = document.getElementById("divRes"); //this is the body
const divResultUser = document.getElementById("divResultUser");
const divResultPath = document.getElementById("divResultPath"); //this is the breadcrumbs menu 
const reposBox = document.getElementById("reposBox");
const activityBox = document.getElementById("activityBox");
const reposBtn = document.getElementById("reposBtn");
const activityBtn = document.getElementById("activityBtn");
const activityRes = document.getElementById("activityRes");

reposBtn.addEventListener("click", (e) => {
    reposBox.classList.remove("d-none");
    activityBox.classList.add("d-none");
    reposBtn.classList.toggle("underline");
    activityBtn.classList.toggle("underline");
});

activityBtn.addEventListener("click", (e) => {
    activityBox.classList.remove("d-none");
    reposBox.classList.add("d-none");
    reposBtn.classList.toggle("underline");
    activityBtn.classList.toggle("underline");
});

const headers = {
        "Authorization": `Basic ${btoa(`c30baaa9c2b46d273bf0:718c040702fb459cb0189fe31fc90177e4f53a15`)}` //OAuth app key
} 
var path = []; //breadcrumbs path

const btnUser = document.getElementById("btnUser");
btnUser.addEventListener("click",()=>{
    //document.getElementById("form").classList.add("d-none");
    getUser();
    getRepos();
    getActivity();
});

async function getUser(){
    clear(); 
    clearPath();
    var username = document.getElementById("username").value;
    const url = "https://api.github.com/users/" + username;
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json();    

    divResultUser.innerHTML = `<div class="card border-primary mb-3" style="max-width: 100rem;">
    <div class="card-header"><h3>${result.name}</h3></div>
    <div class="card-body my-auto">
      <div class="text-center">
      <img class="img-thumbnail avatar" src="${result.avatar_url}" style="height: 15rem;">
      </div>
      <div class="row">
      <div class="col-md-12">
        <span class="badge badge-dark">Public Repos: ${result.public_repos}</span>
        <span class="badge badge-primary">Public Gists: ${result.public_gists}</span>
        <span class="badge badge-success">Followers: ${result.followers}</span>
        <span class="badge badge-info">Following: ${result.following}</span>
        <br><br>
        <ul class="list-group">
          <li class="list-group-item">Company: ${result.company}</li>
          <li class="list-group-item">Website/blog: <a href="${result.blog}" target="_blank">${result.blog}</a></li>
          <li class="list-group-item">Location: ${result.location}</li>
          <li class="list-group-item">Member Since: ${result.created_at.substring(0, 10)}</li>
        </ul>
        </div>
      </div>
    </div>
  </div>`;
}

async function getForkedFrom(i, username){
    const url =  "https://api.github.com/repos/" + username + "/" + i.name;
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json();  
    return result.parent.full_name;
}

async function getRepos(){
    clearPath();
    //clear();
    var username = document.getElementById("username").value;
    while(path.length>0)path.pop();
    const url =  "https://api.github.com/users/" + username + "/repos?sort=created";
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json();  
    for (const i of result){
        // const heading = document.createElement("h5");
        // heading.textContent = i.name;
        // divResult.appendChild(heading);
        const btnrep = document.createElement("button");
        btnrep.setAttribute("id", i.name);
        btnrep.setAttribute("class", "fileBtn");
        btnrep.addEventListener("click", () => {getrepoContent(btnrep.id);});
        btnrep.textContent = i.name;
        divResult.appendChild(btnrep);
        if(i.fork){
            const from = await getForkedFrom(i, username);
            const fork = document.createElement("p");
            fork.style.color= "#688287";
            fork.style.fontSize="13px";
            fork.textContent = "Forked from " + from;
            divResult.appendChild(fork);
        }
        const div = document.createElement("div");
        div.setAttribute("class","row");
        divResult.appendChild(div);
        const col1 = document.createElement("div");
        col1.setAttribute("class","col-md-9");
        div.appendChild(col1);
        const para = document.createElement("p");
        para.textContent = i.description;
        col1.appendChild(para);
        const forks = document.createElement("span");
        forks.textContent = "Forks: " + i.forks_count;
        forks.setAttribute("class","badge badge-dark mx-1");
        col1.appendChild(forks);
        const watchers = document.createElement("span");
        watchers.textContent = "Watchers: " + i.watchers_count;
        watchers.setAttribute("class","badge badge-primary mx-1");
        col1.appendChild(watchers);
        const stars = document.createElement("span");
        stars.textContent = "Stars: " + i.stargazers_count;
        stars.setAttribute("class","badge badge-success mx-1");
        col1.appendChild(stars);
        const col2 = document.createElement("div");
        col2.setAttribute("class","col-md-3");
        div.appendChild(col2);
        divResult.appendChild(document.createElement("hr"));
    }
}

async function getrepoContent(reponame){
    clear(); 
    add(reponame);
    update_Path();
    var username = document.getElementById("username").value;
    const url = "https://api.github.com/repos/"+ username + "/" + reponame + "/contents";
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json(); 
    result.forEach(i=>{

        var sym;
        if(i.type == "file"){
            sym = document.createElement("i");
            sym.setAttribute("class","fa fa-file");
            sym.style.paddingRight="5px";
            sym.style.color="#bae7ff";    
        }
        else{
            sym = document.createElement("i");
            sym.setAttribute("class","fa fa-folder");
            sym.style.paddingRight="5px";
            sym.style.color="#47bfff";
                
        }

        divResult.append(sym);

        const btncontent = document.createElement("button");
        btncontent.textContent = i.name;    
        btncontent.setAttribute("id", i.name);
        btncontent.setAttribute("class", "fileBtn");
        btncontent.addEventListener("click", () => {
            if(i.type == "file")getFileContent(url + "/" + i.name, i.name);
            else getDirContent(url + "/" + i.name, i.name);
        });
        divResult.appendChild(btncontent);
        divResult.appendChild(document.createElement("br"));
    });
}

async function getDirContent(url, name){
    var username = document.getElementById("username").value;
    clear();
    add(name);
    update_Path();
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json(); 
    result.forEach(i=>{
        
        if(i.type == "file"){
            const sym = document.createElement("i");
            sym.setAttribute("class","fa fa-file");
            sym.style.paddingRight="5px";
            sym.style.color="#bae7ff";
            divResult.appendChild(sym);    
        }
        else{
            const sym = document.createElement("i");
            sym.setAttribute("class","fa fa-folder");
            sym.style.paddingRight="5px";
            sym.style.color="#47bfff";
            divResult.appendChild(sym);    
        }    

        const btncontent = document.createElement("button");
        btncontent.textContent = i.name;    
        btncontent.setAttribute("id", i.name);
        btncontent.setAttribute("class", "fileBtn");
        btncontent.addEventListener("click", () => {
            if(i.type == "file")getFileContent(url + "/" + i.name, i.name);
            else getDirContent(url + "/" + i.name, i.name);
        });
        divResult.appendChild(btncontent);
        divResult.appendChild(document.createElement("br"));
    });
}

async function getFileContent(url, name){
    clear(); 
    const filePath = document.createElement("span");
    filePath.textContent = name;
    divResultPath.appendChild(filePath);
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json();
    const filecontent = document.createElement("pre");
    if(url.substring(url.length-3,url.length) == "png"){
        var myImage = document.querySelector('img');
        fetch(response)
        .then(response => response.blob())
        .then(function(myBlob) {
        var objectURL = URL.createObjectURL(myBlob);
        myImage.src = objectURL;
        });
        divResult.appendChild(myImage);
        divResult.appendChild(document.createElement("br"));
    }
    else if(url.substring(url.length-2,url.length) == "md"){
        console.log("md");
        filecontent.setAttribute("class", "prettyprint");
        filecontent.textContent = atob(result.content);
        divResult.appendChild(filecontent);
        divResult.appendChild(document.createElement("br"));
    }
    else{
        filecontent.setAttribute("class", "prettyprint");
        filecontent.textContent = atob(result.content);
        divResult.appendChild(filecontent);
        divResult.appendChild(document.createElement("br"));
    }
}

async function getActivity(){
    activityBox.innerHTML = ``;
    var username = document.getElementById("username").value;
    const url = "https://api.github.com/users/" + username + "/events?per_page=1000";
    const response = await fetch(url, {
        "method" : "GET",
        "headers" : headers
    });
    const result = await response.json();
    console.log(result);
    var prevMonth = result[0].created_at.substring(0, 7);
    var monthMap = {"01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
                     "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"};
    activityBox.innerHTML += `
        <h5 style="color: #4e535c">${monthMap[prevMonth.substring(5, 7)]} ${prevMonth.substring(0, 4)}</h5>
    `;
    result.forEach(i=>{
        month = i.created_at.substring(0, 7);
        if(month != prevMonth){
            activityBox.innerHTML += `
                <hr />
                <h5 style="color: #4e535c">${monthMap[month.substring(5, 7)]} ${month.substring(0, 4)}</h5>
            `;
            prevMonth = month;
        }
        switch(i.type){
            case "CreateEvent":
            if(i.payload.ref == "master"){
                    activityBox.innerHTML += `
                        <br/>
                        <span class="activity">
                            <span class="svg-icon-activity">
                                <svg height="20" viewBox="-18 -18 577.33246 577" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m473.847656 3.714844c-2.347656-2.347656-5.539062-3.652344-8.859375-3.6171878-3.308593.0234378-6.476562 1.3164058-8.855469 3.6171878l-178.664062 178.65625-.496094.503906-.25.25c-.246094.375-.621094.75-.871094 1.121094 0 .125-.125.125-.125.25-.25.371094-.378906.625-.625.996094-.128906.125-.128906.253906-.25.375-.125.375-.246093.625-.375 1 0 .125-.125.125-.125.246093l-31.816406 95.945313c-1.523437 4.464844-.363281 9.414062 3 12.726562 2.355469 2.324219 5.539063 3.625 8.851563 3.617188 1.355469-.027344 2.703125-.234375 3.996093-.625l95.695313-31.9375c.121094 0 .121094 0 .246094-.125.394531-.113282.777343-.28125 1.121093-.496094.097657-.015625.1875-.058594.253907-.128906.371093-.246094.871093-.496094 1.246093-.75.371094-.25.746094-.625 1.121094-.871094.128906-.121094.25-.121094.25-.25.125-.125.375-.25.503906-.496094l178.777344-178.785156c2.339844-2.335938 3.652344-5.5 3.652344-8.796875 0-3.300781-1.3125-6.46875-3.652344-8.796875zm-182.152344 210.597656 35.308594 35.308594-52.902344 17.589844zm58.390626 23.082031-46.164063-46.160156 161.066406-161.070313 46.160157 46.160157zm0 0"/><path d="m444.402344 233.277344c-6.882813.019531-12.457032 5.59375-12.476563 12.476562v233.183594c-.058593 20.644531-16.777343 37.363281-37.429687 37.429688h-332.113282c-20.644531-.066407-37.371093-16.785157-37.429687-37.429688v-332.121094c.058594-20.644531 16.785156-37.367187 37.429687-37.429687h233.175782c6.894531 0 12.476562-5.585938 12.476562-12.476563s-5.582031-12.476562-12.476562-12.476562h-233.175782c-34.449218.015625-62.367187 27.9375-62.382812 62.382812v332.121094c.015625 34.445312 27.933594 62.367188 62.382812 62.378906h332.113282c34.449218-.011718 62.371094-27.933594 62.382812-62.378906v-233.183594c-.019531-6.882812-5.59375-12.457031-12.476562-12.476562zm0 0"/></svg>
                            </span>
                            <span>Created a new repository ${i.repo.name}</span>  
                        </span>                           
                    `;
                    break;
                }else if(i.payload.ref != null){
                    activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                        <span class="svg-icon-activity">
                        <svg height="20" width="20" viewBox="0 0 640 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 192c-70.625 0-128 57.344-128 128 0 47.219 25.875 88.062 64 110.281V448c0 0 0 128-128 128-53.062 0-94.656 11.375-128 28.812V302.28099999999995c38.156-22.219 64-63.062 64-110.281 0-70.656-57.344-128-128-128S0 121.34400000000005 0 192c0 47.219 25.844 88.062 64 110.281V721.75C25.844 743.938 0 784.75 0 832c0 70.625 57.344 128 128 128s128-57.375 128-128c0-33.5-13.188-63.75-34.25-86.625C240.375 722.5 270.656 704 320 704c254 0 256-256 256-256v-17.719c38.125-22.219 64-63.062 64-110.281C640 249.34400000000005 582.625 192 512 192zM128 128c35.406 0 64 28.594 64 64s-28.594 64-64 64-64-28.594-64-64S92.594 128 128 128zM128 896c-35.406 0-64-28.625-64-64 0-35.312 28.594-64 64-64s64 28.688 64 64C192 867.375 163.406 896 128 896zM512 384c-35.375 0-64-28.594-64-64s28.625-64 64-64 64 28.594 64 64S547.375 384 512 384z"/></svg>
                        </span>
                        <span>Created a new branch ${i.payload.ref} in repository ${i.repo.name}</span>    
                    </span>    
                    `;
                    break;
                }
                break;
            case "ForkEvent":
                activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" width="20" id="fork" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M29.8,9.5c-0.3-0.4-0.8-0.6-1.2-0.4L24.1,11l1.8-3.5c0.2-0.4,0.1-0.9-0.2-1.2c-0.3-0.3-0.8-0.4-1.2-0.2L21,7.9l1.8-4.6  c0.2-0.4,0-0.9-0.4-1.2c-0.4-0.3-0.9-0.2-1.3,0.1l-7,7c-1.8,1.8-2,4.5-0.7,6.5L2.9,24.9C2.3,25.4,2,26.2,2,27s0.3,1.6,0.9,2.1  C3.4,29.7,4.2,30,5,30s1.6-0.3,2.2-0.9l9.1-10.7c0.9,0.6,1.8,0.8,2.8,0.8c1.3,0,2.6-0.5,3.6-1.5l7-7C30,10.4,30.1,9.9,29.8,9.5z   M5.7,27.7c-0.4,0.4-1,0.4-1.4,0C4.1,27.5,4,27.3,4,27s0.1-0.5,0.2-0.7l9.8-8.4L5.7,27.7z M21.3,16.3c-1.2,1.2-3.2,1.2-4.5,0  l-1.2-1.2c-1.2-1.2-1.2-3.2,0-4.5l3.5-3.5l-0.9,2.1c-0.2,0.5-0.1,1,0.3,1.3c0.4,0.3,0.9,0.4,1.3,0.2l2.7-1.4L21.3,12  c-0.2,0.4-0.2,1,0.1,1.3c0.3,0.4,0.9,0.5,1.3,0.3l2.1-0.9L21.3,16.3z"/></svg>
                        </span>
                        <span>Forked ${i.payload.forkee.full_name} from ${i.repo.name}</span> 
                    </span>
                `;
                break;
            case "GollumEvent":
                activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" id="Capa_1" style="enable-background:new 0 0 16.763 21.408;" version="1.1" viewBox="0 0 16.763 21.408" width="20" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M16.763,0H6.764L2.558,3.576V17.59h14.205V0L16.763,0z    M8.363,1.257h6.909v15.076H4.048V4.945h4.315V1.257z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#231F20;"/><polygon points="   2.558,5.208 0.073,7.32 0.073,21.334 14.278,21.334 14.278,17.59 12.788,17.59 12.788,20.077 1.563,20.077 1.563,8.69 2.558,8.69     " style="fill-rule:evenodd;clip-rule:evenodd;fill:#231F20;stroke:#231F20;stroke-width:0.1466;stroke-miterlimit:2.6131;"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>
                        </span>
                        <span>Created a gollum</span>     
                    </span>   
                `;
                break;
            case "IssuesEvent":
                if(i.payload.action == "opened"){
                    activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" viewbox="0 0 896 1024" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M448 64C200.562 64 0 264.562 0 512c0 247.438 200.562 448 448 448 247.438 0 448-200.562 448-448C896 264.562 695.438 64 448 64zM448 832c-176.781 0-320-143.25-320-320 0-176.781 143.219-320 320-320 176.75 0 320 143.219 320 320C768 688.75 624.75 832 448 832zM384 768h128V640H384V768zM384 576h128V256H384V576z"/></svg>
                        </span>
                        <span>Opened "${i.payload.issue.title}" issue in ${i.repo.name}</span> 
                    </span> 
                    `;
                }else{
                    activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" viewbox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M704 316.03099999999995l-96 96L768 576l256-256-96-96L769.25 382.781 704 316.03099999999995zM512 832c-176.781 0-320-143.25-320-320 0-176.781 143.219-320 320-320 88.375 0 168.375 35.844 226.25 93.75l90.562-90.5C747.75 114.125 635.75 64 512 64 264.562 64 64 264.562 64 512c0 247.438 200.562 448 448 448 247.438 0 448-200.562 448-448L759.75 712.25C768.688 701.25 684.75 832 512 832zM576 256H448v320h128V256zM448 768h128V640H448V768z"/></svg>
                        </span>
                        <span>Closed "${i.payload.issue.title}" issue in ${i.repo.name}</span>  
                    </span>
                    `;
                }
                break;
            case "MemberEvent":
                activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" width="20" data-name="Layer 1" id="Layer_1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><title/><path d="M32,37.63A18.82,18.82,0,1,0,13.27,18.81,18.79,18.79,0,0,0,32,37.63ZM32,5.57A13.25,13.25,0,1,1,18.83,18.81,13.22,13.22,0,0,1,32,5.57Z" data-name="&lt;Compound Path&gt;" id="_Compound_Path_"/><path d="M12.36,43.69l17.57,6.45L32,50.9l2.07-.76,17.57-6.45A7.28,7.28,0,0,1,58,50.9V58H6V50.9a7.28,7.28,0,0,1,6.36-7.21m38.37-6.06L32,44.51,13.27,37.63A13.27,13.27,0,0,0,0,50.9V64H64V50.9A13.27,13.27,0,0,0,50.73,37.63Z"/></svg>
                        </span>
                        <span>Became a member</span>                     
                    </span>    
                `;
                break;
            case "PullRequestEvent":
                activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-pull-request"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>
                    </span>
                        <span>Made a Pull Request titled "${i.payload.pull_request.title}" in ${i.repo.name}<span>     
                    </span>
                `;
                break;
            case "ReleaseEvent":
                activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="20" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="B_-_126_x2C__Box_x2C__business_x2C__package_x2C__product_release_x2C__release_x2C__shipping_x2C__startup"><g><path d="M212.036,333.048l36.82-84.088L96.108,222.752l-7.918,18.083l126.99,26.288    c1.757,0.368,2.855,2.083,2.533,3.797c-0.369,1.755-2.086,2.898-3.803,2.531L85.532,246.877l-26.244,60.006    C110.151,315.618,161.093,324.313,212.036,333.048 M253.428,207.894l-134.462,12.247l134.502,23.021l134.503-23.021    L253.428,207.894z M447.646,306.883l-26.203-59.843l-128.34,26.573c-1.756,0.328-3.467-0.773-3.835-2.529    c-0.329-1.715,0.776-3.43,2.532-3.796l127.031-26.29l-8.006-18.246L258.078,248.96l36.82,84.088    C345.802,324.313,396.744,315.618,447.646,306.883z M95.575,215.814l151.525-13.839l-34.532-41.922L61.004,173.85L95.575,215.814z     M259.834,201.975l151.525,13.839l34.531-41.964l-151.518-13.797L259.834,201.975z M354.576,50.206l-107.68,41.677l23.922,11.104    l0.079,0.041l0.447,0.203l0.454,0.205c3.71,1.755,7.715,3.47,11.676,5.266L354.576,50.206z M327.273,129.235l30.98-73.681    l-68.248,56.087c3.63,1.673,7.183,3.388,10.484,5.143L327.273,129.235z M294.655,121.233l-19.594-9.144l9.755,28.411    L294.655,121.233z M443.688,402.932c1.756,0,3.229,1.47,3.229,3.267c0,1.754-1.474,3.224-3.229,3.224h-34.164v4.776    l-132.096,22.573c-1.756,0.286-2.939,1.959-2.65,3.756c0.283,1.714,1.96,2.898,3.71,2.611l131.036-22.409v14.899L256.69,461.795    V261.898l33.316,76.049c0.611,1.388,2.078,2.121,3.467,1.878l116.052-19.84v60.538h58.782c1.796,0,3.224,1.468,3.224,3.265    c0,1.755-1.428,3.226-3.224,3.226h-58.782v15.918H443.688z M253.915,112.008c1.269-1.267,3.348-1.267,4.572,0    c1.27,1.265,1.27,3.346,0,4.612l-27.593,27.595c-1.263,1.265-3.309,1.265-4.571,0c-1.263-1.267-1.263-3.308,0-4.572    L253.915,112.008z M263.104,132.541c1.223-1.267,3.302-1.267,4.57,0c1.264,1.265,1.264,3.307,0,4.572l-13.838,13.796    c-1.263,1.267-3.309,1.267-4.571,0c-1.27-1.265-1.27-3.307,0-4.572L263.104,132.541z M269.141,148.092    c1.27-1.265,3.35-1.265,4.611,0c1.23,1.267,1.23,3.307,0,4.572l-22.731,22.737c-1.269,1.265-3.308,1.265-4.571,0    c-1.27-1.267-1.27-3.348,0-4.572L269.141,148.092z M97.371,319.985v35.923H43.693c-1.796,0-3.223,1.47-3.223,3.265    c0,1.755,1.427,3.226,3.223,3.226h53.678v15.919H68.305c-1.795,0-3.223,1.47-3.223,3.266c0,1.755,1.428,3.225,3.223,3.225h29.066    v50.821l152.834,26.166V261.857l-33.269,76.09c-0.612,1.388-2.085,2.121-3.513,1.878L97.371,319.985z" style="fill-rule:evenodd;clip-rule:evenodd;"/></g></g><g id="Layer_1"/></svg>
                    </span>
                        <span>Released Soemthing interesting ;)</span>      
                    </span>  
                `;
                break;
            case "SponsorshipEvent":
                activityBox.innerHTML += `
                    <br/>
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20" width="20" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M11.2,4.3c0.3,0.4,0.7,0.6,1.1,0.8C12.1,5.6,12,6,11.9,6.4c-0.1,0-0.3,0-0.4,0l-0.1,0c-0.3,0-0.7-0.1-1-0.1   c-0.1-0.2-0.3-0.5-0.4-0.7C10,5.5,9.9,5.4,9.9,5.4C10.3,5.2,10.8,4.8,11.2,4.3 M11.2,2C11.2,2,11.2,2,11.2,2c-0.5,0-1,0.1-1.5,0.9   c-0.4,0.7-1,0.7-1.9,0.7c-0.8,0-1,0.6-0.6,1.2c0.2,0.3,1.5,2.5,1.8,3c0.3,0.4,1.5,0.7,2.4,0.7c0.1,0,0.1,0,0.2,0   c0.9,0,2.3-0.4,2.2-1.1c-0.1-1.3,1.2-3,1.4-3.2c0.3-0.4,0.2-1.3-0.6-1.3c-0.2,0-0.4,0-0.6,0.1c-0.2,0.1-0.5,0.2-0.8,0.2   c-0.2,0-0.4-0.1-0.5-0.3C12.1,2.1,11.6,2,11.2,2L11.2,2z"/></g><g><path d="M9,7.8c0.3,0.5,1.7,0.7,2.6,0.7c0.9,0,2.3-0.4,2.2-1.1c-0.1-1.3,1.2-3,1.4-3.2c-0.4,0.2-0.7,0.5-1.1,0.4   C13.9,4.8,13.4,6,12.4,6c-0.7,0-0.8-1-1.3-1c-0.5,0-0.6,0.7-1,0.8C9.2,6,8.5,5.1,8,4.5c-0.2,0-0.6-0.3-0.8,0.4   C7.4,5.1,8.7,7.3,9,7.8z"/></g><path d="M13.6,8.8c-0.7,0.3-1.5,0.5-2,0.5l-0.2,0c-0.2,0-1.1,0-1.9-0.3C5.2,10.3,2,14.7,2,17.8C2,21.5,6.5,22,12,22s10-0.5,10-4.2  C22,14.5,18.4,9.8,13.6,8.8z M11.6,14.5c0.1,0.1,0.3,0.3,0.6,0.5c0.6,0.2,1.1,0.5,1.4,0.8c0.3,0.3,0.5,0.8,0.5,1.4  c0,0.5-0.2,1-0.5,1.3c-0.3,0.3-0.7,0.5-1.2,0.6V20h-0.7v-0.9c-0.5-0.1-1-0.3-1.3-0.6c-0.3-0.3-0.5-0.9-0.5-1.5l0,0h1.3  c0,0.4,0.1,0.7,0.2,0.9s0.4,0.3,0.6,0.3c0.2,0,0.4-0.1,0.5-0.2c0.1-0.2,0.2-0.4,0.2-0.6c0-0.3-0.1-0.5-0.2-0.6  c-0.1-0.2-0.3-0.3-0.6-0.5c-0.6-0.2-1.1-0.5-1.4-0.8s-0.5-0.8-0.5-1.3c0-0.5,0.2-1,0.5-1.3c0.3-0.3,0.7-0.5,1.2-0.6v-1h0.7v1  c0.5,0.1,0.9,0.3,1.2,0.7s0.4,0.8,0.4,1.4h-1.3c0-0.3-0.1-0.6-0.2-0.8c-0.1-0.2-0.3-0.3-0.5-0.3c-0.2,0-0.4,0.1-0.5,0.2  c-0.1,0.2-0.1,0.4-0.1,0.6C11.5,14.2,11.5,14.4,11.6,14.5z"/></svg>
                    </span>
                        <span>Yayy! sponsored xyz</span>    
                    </span>    
                `;
                break;
            case "WatchEvent":
                activityBox.innerHTML += `
                    <br />
                    <span class="activity">
                    <span class="svg-icon-activity">
                        <svg height="20"  viewBox="0 0 512 512" width="20"  xmlns="http://www.w3.org/2000/svg" ><g><path d="M256,128c-81.9,0-145.7,48.8-224,128c67.4,67.7,124,128,224,128c99.9,0,173.4-76.4,224-126.6   C428.2,198.6,354.8,128,256,128z M256,347.3c-49.4,0-89.6-41-89.6-91.3c0-50.4,40.2-91.3,89.6-91.3s89.6,41,89.6,91.3   C345.6,306.4,305.4,347.3,256,347.3z"/><g><path d="M256,224c0-7.9,2.9-15.1,7.6-20.7c-2.5-0.4-5-0.6-7.6-0.6c-28.8,0-52.3,23.9-52.3,53.3c0,29.4,23.5,53.3,52.3,53.3    s52.3-23.9,52.3-53.3c0-2.3-0.2-4.6-0.4-6.9c-5.5,4.3-12.3,6.9-19.8,6.9C270.3,256,256,241.7,256,224z"/></g></g></svg>
                    </span>
                        <span>Started watching ${i.repo.name}</span>       
                    </span> 
                `;
                break;
            default:
                break;
        }
    });    
}

//Utility functions for path and clearing the divs-----------

function remove(name){
    while(path[path.length-1]!=name){
        path.pop();
    }
}

function add(name){
    if(path[path.length-1]!=name)
        path.push(name);
}

function removePathButton(name, url){
    remove(name);
    getDirContent(url, name);
}


function update_Path(){
    clearPath();
    if(path.length == 0)return;
    var username = document.getElementById("username").value;
    var filePath = document.createElement("button");
    filePath.addEventListener("click", () => {clearPath();getUser();getRepos();});
    filePath.textContent = "repos";
    divResultPath.appendChild(filePath);
    var gap = document.createElement("span");
    gap.textContent = " / ";
    divResultPath.appendChild(gap);
    filePath = document.createElement("button");
    filePath.addEventListener("click", () => {remove(path[0]);clearPath();getrepoContent(path[0]);});
    filePath.textContent = path[0];
    divResultPath.appendChild(filePath);
    gap = document.createElement("span");
    gap.textContent = " / ";
    divResultPath.appendChild(gap);
    var url = "https://api.github.com/repos/" + username + "/" + path[0] + "/contents";
    for(i=1;i<path.length;i++){
        url += "/" + path[i];
        const filePath = document.createElement("button");
        filePath.textContent = path[i];
        const thisURL = url;
        const thisName = path[i];
        filePath.addEventListener("click", ()=>{removePathButton(thisName, thisURL);});
        divResultPath.appendChild(filePath);
        const gap = document.createElement("span");
        gap.textContent = " / ";
        divResultPath.appendChild(gap);
    }
}

function clear() {
    while(divResult.firstChild)divResult.removeChild(divResult.firstChild);
}
function clearPath() {
    while(divResultPath.firstChild)divResultPath.removeChild(divResultPath.firstChild);
}