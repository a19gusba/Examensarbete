// minimal heatmap instance configuration
var heatmapInstance = h337.create({
    // only container is required, the rest will be defaults
    container: document.querySelector('#heatmap-container')
});

// now generate some random data
var points = [];
var max = 0;
var width = 600;
var height = 600;
var len = 200;

while (len--) {
    var val = Math.floor(Math.random() * 100);
    max = Math.max(max, val);
    var point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val
    };
    points.push(point);
}
// heatmap data format
var data = {
    max: max,
    data: points
};
// if you have a set of datapoints always use setData instead of addData
// for data initialization
heatmapInstance.setData(data)