// 1. Fetch data from the API
    // Accept the searched word as an arguemnt
    // Build the API request Url
    // Send requests and wait for response
    // Handle errors
    // Return json data or failure

// 2. Parse and display the fetched data
    // Create a function that recieves API response data
        // Extract info (word, definition, pronunciation, etc)
        // Clear previous search
        // Update the results
        // Handle missing data gracefully

// 3. Handle user input and events
    // Create an event handler for searchfrom submission
    // Prevent the default form submission
    // Read and validate user inputs
    // Trigger API-Fetch Function
    // Pass returned data to the display function


async function fetchWordData(word) {
    word = word.trim();
    if (!word) return null;
    
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(url); 

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Word not found");
        }

        return data;

    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}

    function displayWordData(data){
        const resultsDiv = document.getElementById("results");
        const wordHeading = resultsDiv.querySelector("h2");
        const audioElement = resultsDiv.querySelector("audio");
        const phoneticPara = resultsDiv.querySelector("#phoneticText");

        // If no data
        if (!data || data.length === 0) {
            wordHeading.textContent = "No results found";
            phoneticPara.textContent= "";
            phoneticPara.style.display = "none";
            audioElement.style.display = "none";

            const definitionsContainer = resultsDiv.querySelector("#definitionsContainer");
            definitionsContainer.innerHTML = "";

            return;
        }

        // First entry
        const entry = data[0];

        // word
        wordHeading.textContent = entry.word || "Unknown word";

        // Phonetics

        let phoneticText = null;

        if (entry.phonetics && entry.phonetics.length > 0) {
            for (let phonetic of entry.phonetics) {
                if (phonetic.text) {
                    phoneticText = phonetic.text;
                    break;
                }
            }
        }

        if (phoneticText) {
            phoneticPara.textContent = phoneticText
            phoneticPara.style.display = "block";
        } else {
            phoneticPara.textContent = "";
            phoneticPara.style.display = "none";
        }

        // Audio
        let audioSource = null;

        if(entry.phonetics && entry.phonetics.length > 0) {
            for (let phonetic of entry.phonetics) {
                if (phonetic.audio) {
                    audioSource = phonetic.audio;
                    break;
                }
            }
        }

        if (audioSource) {
            audioElement.src = audioSource;
            audioElement.style.display = "block";
        } else {
            audioElement.removeAttribute("src");
            audioElement.style.display = "none";
        }

        // Definitions
        const definitionsContainer = resultsDiv.querySelector("#definitionsContainer");
        definitionsContainer.innerHTML = "";
        
        let definitions = [];
        let synonyms = [];

        if (entry.meanings && entry.meanings.length > 0){
            for (let meaning of entry.meanings) {
                if(meaning.definitions){
                    for (let def of meaning.definitions){
                        if (def.definition){
                            definitions.push(def.definition);
                        }
                    }
                }

                if(meaning.synonyms && meaning.synonyms.length >0) {
                    synonyms.push(...meaning.synonyms);
                }
            }
        }

        if (definitions.length > 0){
            const ul = document.createElement("ul");
            for (let definition of definitions) {
                const li = document.createElement("li");
                li.textContent = definition;
                ul.appendChild(li);
            }
            definitionsContainer.appendChild(ul);
    } else {
        definitionsContainer.textContent = "No definitions found."
    }

    // Synonyms
    if (synonyms.length > 0) {
        synonyms = [...new Set(synonyms)]; // Get rid of duplicates
        
        const synDiv = document.createElement("div");
        synDiv.id = "synonyms";
        synDiv.textContent = "Synonyms: " + synonyms.join(", ");
        definitionsContainer.appendChild(synDiv);
    }
}

    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const word = input.value.trim();

        if(!word) {
            alert("Please enter a word.");
            return;
        }

        const data = await fetchWordData(word);
        displayWordData(data);
    });
