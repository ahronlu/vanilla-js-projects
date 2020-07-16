const header = document.getElementsByTagName('header')[0];

fetch('https://api.jsonbin.io/b/5e4e97abd3c2f35597f4940c')
    .then(resp => resp.json())
    .then(workout => {
giveId(workout);

// giving ID to every part and exercise
function giveId(workout) {
    let c = 0;
    for(let i = 0; i<workout.parts.length; i++) {
     workout.parts[i].id = i+1;
     for(let j = 0; j<workout.parts[i].exercises.length; j++) { 
      workout.parts[i].exercises[j].id = c + 1;
      c++;
    }
    }
}

// creating headline and description of the workout
const main = document.getElementsByTagName('main')[0];
main.innerHTML += `<h1>${workout.title}</h1>`;
main.innerHTML += `<p>${workout.description}</p>`;

createSections();

// listeners to each button in the end backdrop

document.getElementById('endWorkoutButton').addEventListener('click', toggleBackdrop);
document.getElementById('backdrop').addEventListener('click', toggleBackdrop);

// toggle backdrop
function toggleBackdrop() {
    const backdrop = document.getElementById('backdrop');
    backdrop.classList.toggle('visible');
}

// duration of the workout

let workoutDuration = document.getElementsByClassName('duration')[0];
let seconds = 0, minutes = 0, hours = 0, t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    workoutDuration.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
timer();

function createSections() {
    workout.parts.forEach(function(part) {
        const section = document.createElement('section');
        section.innerHTML = `<header><h3 class="accordion">${part.title}</h3><p>${part.description}</p></header>`;
        section.setAttribute('class', `${part.title}`)
        main.appendChild(section);
        for(let i = 0; i < part.sets; i++){
            part.exercises.forEach(function(exercise) {
                    createExerciseDiv(exercise, section);
                    createRestDiv(part, section);
            })
        }
    });
}


// make a div of each exersice of the part/section

function createExerciseDiv(exercise, section) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = `${exercise.title}-div`;
    section.appendChild(exerciseDiv);
    exerciseDiv.innerHTML =`<a href='https://www.youtube.com/embed/${exercise.videoId}' target='_blank'>
    <img src='https://img.youtube.com/vi/${exercise.videoId}/0.jpg'>${exercise.title}<br />${displayRepsForEachExercise(exercise)}</a>`;
    createRepsButton(exercise, exerciseDiv);
}

function displayRepsForEachExercise(exercise) {
    if (exercise.seconds == true){
        return `${exercise.maxReps} seconds`;
    } else if(!exercise.minReps){
        return `${exercise.maxReps} reps`;
    }
    return `${exercise.minReps}-${exercise.maxReps} reps`;
}

// create the reps button of each exercise

function createRepsButton(exercise, exerciseDiv) {
    const repsButton = document.createElement('input');
    repsButton.setAttribute('readonly', 'readonly');
    repsButton.addEventListener('click', repsButtonCounter.bind(repsButton, exercise))
    //added this line below - when you draw the exercise button, draw how many reps if there are saved...
    if(exercise.reps) repsButton.innerHTML = exercise.reps;
    exerciseDiv.appendChild(repsButton);
}

// create rest div

function createRestDiv(part, section) {
    if(part.rest){
        const restDiv = document.createElement('div');
        restDiv.className ='restDiv';
        restDiv.innerHTML = `<i class='bx bx-time-five'></i> Rest for ${part.rest} seconds`;
        section.appendChild(restDiv);
    }
}

// make every button count the reps

function repsButtonCounter(exercise) {
    if (!this.value){
        this.value = exercise.maxReps;
    } else if(this.value == 1) {
        this.value = null;
    } else {
        this.value --;
    }
    //save the counter inside the object..so you can save it afterwards
    exercise.reps = this.value;
}

function saveWorkout() {
    let doneExercises = [];
    for(let i = 0; i < workout.parts.length; i++) {
        for(let j = 0; j < workout.parts[i].exercises.length; j++) {
            doneExercises.push({title: workout.parts[i].exercises[j].title, reps: workout.parts[i].exercises[j].reps});
        }
    }
    const doneWorkout = {
        title: workout.title,
        doneExercises: doneExercises,
        duration: workoutDuration.textContent,
        date: new Date()
    }
    console.log(doneWorkout)
}
document.getElementById('saveWorkout').addEventListener('click', saveWorkout);
})