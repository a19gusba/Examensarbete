function removeSpikes(ms, data) {
    return data.loaded.filter((item, i) => {
        if (item.render > ms) console.log(i)
        return item.render <= ms
    })
}

function downloadData(data, library, am) {
    // Create download element
    var htmlElement = `<a id="downloadObElement" style="display:none"></a>`;
    document.querySelector("#container").insertAdjacentHTML("beforeend", htmlElement)

    // Add the data to the element
    var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    var e = document.getElementById('downloadObElement');
    e.setAttribute("href", dataStr);
    e.setAttribute("download", `${library}_noSpikes_${am}.json`);
    e.click();

    // Remove element
    e.parentNode.removeChild(e);
}


downloadData(removeSpikes(5, d3_data_100_000), "D3", 100000)