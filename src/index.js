//---------- GLOBAL VARIABLES ----------//

const spiceBlendsUrl = 'http://localhost:3000/spiceblends'
const ingredientsUrl = 'http://localhost:3000/ingredients'

const spiceDetail = document.querySelector('#spice-blend-detail')
const spiceImg = spiceDetail.querySelector('#spice-blend-detail > img')
const spiceTitle = spiceDetail.querySelector('#spice-blend-detail > h2')
const ingredientUl = spiceDetail.querySelector('#spice-blend-detail > div > ul')

const spiceBar = document.querySelector('#spice-images')

const titleForm = document.querySelector('#update-form')
const addIngredientForm = document.querySelector('#ingredient-form')

console.log(spiceDetail)
console.log(spiceImg)

//---------- Rendering Spice ----------//
function renderFirstSpice() {
    fetch(spiceBlendsUrl)
        .then(response => response.json())
        .then(spiceBlendsArr => {
            titleForm.dataset.id = spiceBlendsArr[0].id
            titleForm.title.value = spiceBlendsArr[0].title
            addIngredientForm.dataset.id = spiceBlendsArr[0].id

            spiceDetail.dataset.id = spiceBlendsArr[0].id
            spiceImg.src = spiceBlendsArr[0].image
            spiceImg.alt = spiceBlendsArr[0].title
            spiceTitle.textContent = spiceBlendsArr[0].title
        })
}

renderFirstSpice()
//---------- Rendering Ingredient ----------//
function renderIngredients() {
    fetch(ingredientsUrl)
        .then(response => response.json())
        .then(ingredientArr => {
            ingredientArr.forEach(ingredient=> {
                // debugger
                if (ingredient.spiceblendId == spiceDetail.dataset.id){
                    const ingLi = document.createElement('li')
                    ingLi.textContent = ingredient.name
                    ingredientUl.append(ingLi)
                }
            })
        })
}

renderIngredients()

//---------- Update spice title ----------//

titleForm.addEventListener('submit', function(event){
    event.preventDefault()
    const newTitle = titleForm.title.value 

    fetch(`${spiceBlendsUrl}/${titleForm.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
    })
    .then(resp => resp.json())
    .then(spice =>{
        titleForm.dataset.id = spice.id
        spiceDetail.dataset.id = spice.id
        spiceImg.src = spice.image
        spiceImg.alt = spice.title
        spiceTitle.textContent = spice.title
    })
    titleForm.reset()
})

//---------- Add New Ingredient ----------//

addIngredientForm.addEventListener('submit', function(event){
    event.preventDefault()
    const name = addIngredientForm.name.value 
    const spiceblendId = Number(addIngredientForm.dataset.id)

    fetch(ingredientsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ name, spiceblendId })
    })
    .then(resp => resp.json())
    .then(ingredient =>{
        const ingLi = document.createElement('li')
        ingLi.textContent = ingredient.name
        ingredientUl.append(ingLi)
    })
    addIngredientForm.reset()
})

//---------- Spice Images Bar ----------//

fetch(spiceBlendsUrl)
        .then(response => response.json())
        .then(spiceBlendsArr => { 
            spiceBlendsArr.forEach(spice =>{
                const img = document.createElement('img')
                img.dataset.id = spice.id
                img.src = spice.image
                img.alt = spice.title
                spiceBar.append(img)
            })
        })

//---------- Spice Images Bar eventSelector ----------//

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


spiceBar.addEventListener('click', function(event){
    if (event.target.matches('img')){
        const newSpiceId = event.target.dataset.id
        fetch(`${spiceBlendsUrl}/${newSpiceId}`)
            .then(response => response.json())
            .then(spice => {
                titleForm.dataset.id = spice.id
                titleForm.title.value = spice.title
                addIngredientForm.dataset.id = spice.id
    
                spiceDetail.dataset.id = spice.id
                spiceImg.src = spice.image
                spiceImg.alt = spice.title
                spiceTitle.textContent = spice.title

                removeAllChildNodes(ingredientUl)
                renderIngredients()
            })
            // debugger
    }
})