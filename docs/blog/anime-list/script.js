fetch('anime-list.json')
        .then(response => response.json())
        .then(jsonData => {
            // Process the JSON data for Dropped anime
            jsonData.Dropped.forEach(item => {
                appendAnimeRow(item, "dropped");
            });

            // Process the JSON data for Watching anime
            jsonData.Watching.forEach(item => {
                appendAnimeRow(item, "watching");
            });

            // Process the JSON data for On-Hold anime
            jsonData["On-Hold"].forEach(item => {
                appendAnimeRow(item, "on-hold");
            });

            // Process the JSON data for Completed anime
            jsonData.Completed.forEach(item => {
                appendAnimeRow(item, "completed");
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));

    // Function to append a row to the specified table with anime data
    function appendAnimeRow(item, tableId) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        const linkCell = document.createElement("td");
        const link = document.createElement("a");
        link.textContent = "Link";
        link.href = item.link;
        link.target = "_blank"; // Open link in a new tab
        linkCell.appendChild(link);
        row.appendChild(nameCell);
        row.appendChild(linkCell);
        document.getElementById(tableId).appendChild(row);
    }