// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', (event) => {

    // Get references to the HTML elements
    const addButton = document.getElementById('add');           // Button to add new tasks
    const newTaskInput = document.getElementById('newtask');    // Input field for new tasks
    const todoList = document.getElementById('todolist');      // Container for the list of tasks
    const value1 = document.getElementById('value1');          // Element to display the count of completed tasks
    const value2 = document.getElementById('value2');          // Element to display the total count of tasks
    const fill = document.getElementById('fill');              // Element to display the progress fill
    const bar = document.getElementById('bar');                // Progress bar element
    let taskCount = 0;   // Counter for total tasks
    let taskcomp = 0;    // Counter for completed tasks

    /**
     * Updates the image displayed when there are no tasks in the list.
     */
    function updateImage() {
        if (todoList.children.length === 0) {
            const img = document.createElement('img');
            img.src = 'png.png'; // Placeholder for the actual image path
            img.id = 'todo-image'; // Assign an ID to the image for styling or manipulation
            todoList.appendChild(img);
        }
    }

    /**
     * Updates the visibility of the scrollbar based on the number of visible tasks.
     */
    function updateScrollBar() {
        // Filter visible tasks
        const visibleTasks = Array.from(todoList.children).filter(task => {
            return getComputedStyle(task).display !== 'none';
        });

        // Show or hide the scrollbar based on the number of visible tasks
        if (visibleTasks.length < 4) {
            todoList.style.overflowY = 'hidden';  // Hide scrollbar when fewer than 4 visible tasks
        } else {
            todoList.style.overflowY = 'scroll';  // Show scrollbar when 4 or more visible tasks
        }
    }

    /**
     * Creates a new task element and adds it to the todo list.
     */
    function addNewTask() {
        const taskText = newTaskInput.value.trim(); // Get and trim the input value
        
        // Check if the input is not empty
        if (taskText === '') {
            alert('Please enter a task!'); // Alert the user if the input is empty
            return;
        }

        // Check for duplicate tasks
        const tasks = todoList.getElementsByTagName('h1');
        for (let task of tasks) {
            if (task.textContent === taskText) {
                alert('Task already exists!'); // Alert if the task already exists
                return;
            }
        }
        
        // Create a new task container
        const newDiv = document.createElement('div');
        newDiv.classList.add('task-container');
        
        // Create a new checkbox element
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');

        // Create a new h1 element for the task text
        const newH1 = document.createElement('h1');
        newH1.textContent = taskText;
        newH1.classList.add('task-text');
        
        // Remove the placeholder image if it exists
        const image = document.querySelector('#todolist img');
        if (image) {
            image.remove();
        }
        
        // Create a delete icon
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon', 'deleteButton');
        
        // Append elements to the new task container
        newDiv.appendChild(checkbox);
        newDiv.appendChild(newH1);
        newDiv.appendChild(deleteIcon);
        
        // Append the new task container to the todo list
        todoList.appendChild(newDiv);

        // Update scrollbar visibility
        updateScrollBar();
        
        // Increment the task count and update the display
        taskCount++;
        value2.textContent = taskCount;
        
        // Recalculate and update the progress bar
        updateProgress();
        
        // Clear the input field
        newTaskInput.value = '';
        
        // Add event listener for the checkbox to toggle the task completion state
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                newH1.style.fontWeight = 'normal'; // Adjust text styling when checked
                newH1.style.animation = 'normalzz 0.5s ease-in-out';
               
                // Increment the completed task count
                taskcomp++;
                value1.textContent = taskcomp;
            } else {
                taskcomp--;
                value1.textContent = taskcomp;
                newH1.style.fontWeight = 'normal'; // Revert text styling when unchecked
                newH1.style.animation = 'reverzz 0.5s ease-in-out';
            }

            // Recalculate the progress after checking/unchecking a task
            updateProgress();
        });
    }
    
    /**
     * Updates the progress bar based on the ratio of completed to total tasks.
     */
    function updateProgress() {
        let targetProgress;

        // Set progress to 0 if there are no tasks
        if (taskCount === 0) {
            targetProgress = 0;
        } else {
            targetProgress = (taskcomp / taskCount) * 100; // Calculate the percentage of completed tasks
        }
        
        // Animate the progress bar
        const currentProgress = bar.value;
        const step = (targetProgress - currentProgress) / 10; // Divide the change into 10 steps
        let currentStep = 0;

        function animateProgress() {
            if (currentStep < 10) {
                currentStep++;
                bar.value = currentProgress + step * currentStep; // Update progress value
                fill.style.height = `${bar.value}%`; // Update fill height to reflect progress
                requestAnimationFrame(animateProgress); // Continue animation
            } else {
                bar.value = targetProgress; // Set progress bar to final value
                fill.style.height = `${targetProgress}%`; // Set final fill height
            }
        }

        animateProgress();
    }

    /**
     * Handles task deletion when the delete button is clicked.
     * @param {Event} event - The click event
     */
    todoList.addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteButton')) {
            const parentDiv = event.target.parentElement; // Get the parent task container

            // Check if the task being deleted is checked
            const isChecked = parentDiv.querySelector('.task-checkbox').checked;

            parentDiv.remove(); // Remove the task container
            updateImage(); // Update image if needed
            
            // Update task count and completed task count
            taskCount--;
            value2.textContent = taskCount;

            if (isChecked) {
                taskcomp--;
                value1.textContent = taskcomp;
            }

            // Update scrollbar visibility and progress after deletion
            updateScrollBar();
            updateProgress();
        }
    });

    // Add event listeners for task management
    addButton.addEventListener('click', addNewTask);
    newTaskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addNewTask();  // Call the function to add a new task when Enter key is pressed
        }
    });

    /**
     * Filters tasks based on their completion status.
     * @param {string} filter - The filter type ('completed', 'incomplete', or 'all')
     */
    function filterTasks(filter) {
        const tasks = todoList.children;
        for (let task of tasks) {
            const checkbox = task.querySelector('.task-checkbox');
            if (filter === 'completed' && !checkbox.checked) {
                task.style.display = 'none'; // Hide incomplete tasks if filter is 'completed'
            } else if (filter === 'incomplete' && checkbox.checked) {
                task.style.display = 'none'; // Hide completed tasks if filter is 'incomplete'
            } else {
                task.style.display = 'flex'; // Show task if it matches the filter
            }
        }
        updateScrollBar(); // Update scrollbar visibility
    }
    
    /**
     * Deletes all tasks from the list and resets the counters.
     */
    function deleteAllTasks() {
        todoList.innerHTML = ''; // Clear all tasks
        updateImage(); // Update image if needed
        taskCount = 0;
        taskcomp = 0;
        value1.textContent = taskcomp;
        value2.textContent = taskCount;
        updateProgress(); // Update progress bar
    }
    
    // Add event listeners for filtering and deleting tasks
    document.getElementById('completed').addEventListener('click', () => filterTasks('completed'));
    document.getElementById('incomplete').addEventListener('click', () => filterTasks('incomplete'));
    document.getElementById('show-all').addEventListener('click', () => filterTasks('all'));
    document.getElementById('delete-all').addEventListener('click', deleteAllTasks);

});
