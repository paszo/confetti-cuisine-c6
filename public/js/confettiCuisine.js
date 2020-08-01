// the jquery free version of the javascript file
let my_modal = document.getElementById("myModal");
let modal_button = document.getElementById("modal-button");
let modal_body = document.getElementsByClassName("modal-body");
let close_modal = document.getElementById("closeModal");

console.log('modal-body', modal_body);
console.log('modal-body[0]', modal_body[0]);
console.log('my_modal', my_modal);
console.log('my_modal[0]', my_modal[0]);
console.log('close_modal', close_modal);

function fetch_courses() {
    fetch("/api/courses")
    .then(response => response.json())
    .then(response => response.data.courses)
        .then(courses => {
            my_modal.style.display = 'block';
            modal_body[0].innerHTML = '';
            courses.forEach((course) => {
                console.log('I add to dom a course', course);
                modal_body[0].innerHTML += `<div><span class="course-title">${course.title}</span>
<button class="${course.joined ? "joined-button" : "join-button"}">${course.joined ? "Joined" : "Join"}</button>
<div class="course-description">${course.description}</div></div>`;
            })
        })
        .catch(() => console.log('some error in fetching'));
}

modal_button.addEventListener('click', fetch_courses);
close_modal.addEventListener('click', () => {my_modal.style.display = 'none'});


function addJoinButtonListener () {

};


