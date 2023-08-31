const dropArea = document.querySelector("#upload-space");
button = document.querySelector("#btn");
dragText = document.querySelector("#dragText");
input = document.querySelector("#file-upload");
let file;

// console.log(dropArea);
// console.log(button);
// console.log(input);

button.onclick = ()=>{
    input.click();
}

input.addEventListener("change", function(){
    file = this.files[0];
    dropArea.classList.add("active");
    showFile(); //calling function
  });
  //If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", ()=>{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event)=>{
    event.preventDefault(); //preventing from default behaviour
    file = event.dataTransfer.files[0];
    showFile();
});

async function showFile(){
    let fileType = file.type;
    console.log(fileType)
    let validExtensions = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    // "application/vnd.ms-excel"

    if(validExtensions.includes(fileType)){
        let fileReader = new FileReader();
        fileReader.addEventListener('load', async ()=>{
            let data = new FormData;
            data.append('sheet', file);

            const response = await fetch('/', {
                method: 'POST',
                body: data
            }).then(
                resp => resp.json() // if the response is a JSON object
            ).then(
                success => {
                    console.log(success);
                    window.location.replace("/search");
                }
            ).catch(
                error => console.log(error)
            );
        });
        fileReader.readAsArrayBuffer(file);
    }
    else{
      alert("This is not a valid File!");
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    }
}