/*
When the page loads, show the first 50 monsters. Each monster's name, age, and description should be shown.
Above your list of monsters, you should have a form to create a new monster. You should have fields for name, age, and description, and a 'Create Monster Button'. When you click the button, the monster should be added to the list and saved in the API.
At the end of the list of monsters, show a button. When clicked, the button should load the next 50 monsters and show them.
*/

const URL_PREFIX='http://localhost:3000/';

let currentPage = 0;

function fetchMonsters(pageNumber = 0, limit = 50) {
    return fetch(`${URL_PREFIX}monsters/?_limit=${limit}&_page=${pageNumber}`)
        .then((response)=>{
            return response.json()
        })
}

function text_element(type, string) {
    var element = document.createElement(type);
    element.appendChild(document.createTextNode(string));
    return element;
}

function monsterHTML(monster_object) {
    containing_div = document.createElement("div")
    containing_div.appendChild(text_element("h2", monster_object["name"]))
    containing_div.appendChild(text_element("h4", monster_object["age"]))
    containing_div.appendChild(text_element("p",  monster_object["description"]))
    return containing_div
}

function showPage(page) {
    // clear current page contents and replace with loading
    let monster_container = document.getElementById("monster-container")
    monster_container.replaceChildren(text_element("p", "loading"))

    fetchMonsters(page).then((data)=>{
        let monsters = []
        for (let monster of data) {
            monsters.push(monsterHTML(monster))
        }
        // replace loading with developed html
        monster_container.replaceChildren(...monsters)
    })
}

function input_element(id, placeholder){
    var element = document.createElement("input")
    element.id = id
    element.placeholder = placeholder
    return element
}

/* { name: string, age: number, description: string } */
function addMonster(name,age,description) {
    const configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: name,
            age: parseFloat(age),
            description: description
        })
    }
    fetch(`${URL_PREFIX}monsters`, configurationObject).then(
        function (response) {
            // show new data
            showPage(currentPage)
            return response.json();
        })
}

function addMonsterMaker(){
    let div = document.querySelector("div#create-monster")

    let nameInput = input_element("name", "name...")
    let ageInput = input_element("age", "age...")
    let description = input_element("description", "description...")
    let createButton = document.createElement("button")

    div.append(nameInput, ageInput, description, createButton)

    createButton.addEventListener("mouseup",()=>
        {addMonster(nameInput.value,ageInput.value,description.value)})
}

document.addEventListener('DOMContentLoaded', (event) => {
    showPage(0)

    document.querySelector("button#back").addEventListener("click", ()=>{
        if (currentPage > 0) {
            currentPage = currentPage - 1
            showPage(currentPage)
        }
    })
    document.querySelector("button#forward").addEventListener("click", ()=>{
        currentPage = currentPage + 1
        showPage(currentPage)
    })

    addMonsterMaker()
})