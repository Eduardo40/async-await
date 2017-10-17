function get(url){
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open("GET",url,true);
        xhr.onload = function(data){
            if(data.target.status === 200){
                resolve(JSON.parse(data.target.response));
            }else {
                reject(data.target.status);
            }
        }
        xhr.send();
    });
}

function getFollowers() {
    let users = [];
    if(arguments.length === 0){
        return 'There is no users to get...';
    }
    Array.from(arguments).forEach(user => {
        let user2 = get(`https://api.github.com/users/${user}`);
        users.push(user2);
    })
    return Promise.all(users);
}

// NO async-await

getFollowers("peter","Eduardo40","colt","torvalds","elie").then(users => {
    let result;
    if(users.length === 1){
        console.log(`${users[0].login} has ${users[0].followers} followers`);
    }else if(users.length > 1){
        result = users.sort((user1, user2) => {
            return user2.followers - user1.followers; 
        })
         console.log(`${result[0].login} has the most followers with ${result[0].followers}.`);
    }
});

//async-await rocks!

async function starWarsString(number){
        let actor = await get(`https://swapi.co/api/people/${number}`)
        let actorFilm = await get(actor.films[0])
        let planetFilm = await get(actorFilm.planets[0])
        return Promise.all([actor,actorFilm,planetFilm]);
}

starWarsString(2).then(data =>{
    const actor = data[0];
    const movie = data[1];
    const planet = data[2];
    console.log(`${actor.name} is featured in "${movie.title}", which takes place on "${planet.name}", directed by ${movie.director}`)
})