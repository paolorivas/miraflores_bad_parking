(function() {
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  /*
  Change it from appending an svg
  to appending a 'fake'
  */
  var svg = d3.select("#ghost-chart")
        .append("fake")
        .attr("height", height)
        .attr("width", width);
        // .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal().range(['red', 'orange', 'baige', 'yellow', 'purple', 'pink', 'green','lightblue', 'blue', 'bronwn', '#2F4F4F', 'black'])

  /*
    Add a canvas into our div for the chart
    and then get the context (the paintbrush/etc)
  */
  var canvas = d3.select("#ghost-chart")
    .append("canvas")
    .attr("height", height)
    .attr("width", width);

  var context = canvas.node().getContext("2d")

  /* Okay now import the files */

  d3.queue()
    .defer(d3.csv, "miraflores_badparking_last.csv", function(d, i) {
      d.index = i;
      return d;
    })
    .await(ready)

  function ready (error, datapoints) {
    var start = Date.now()

    svg.selectAll(".Month")
      .data(datapoints, function(d) {
        // this is a UNIQUE IDENTIFIER for
        // that particular row so that
        // d3 can keep track of it
        return d.index
      })
      .enter().append("circle")
      .attr("r", 2.5)
      .attr("fill", function(d) {
        // MULTIPLE COLORS SPEEDUP STEP 1:
        // be sure to use colorScale in fill for the
        // d3 element so d3 knows all of the possible
        // values ("Technology", "Medicine", etc)
        return colorScale(d.Month);
      })
      .attr("cy", function(d, i) {
        return 7 * parseInt(i / 110);
      })
      .attr("cx", function(d, i) {
        return 7 * (i % 110);
      })

    d3.select("#ghostrender").text(Date.now() - start)

    function redraw() {
      var start = Date.now()

      // ERASE EVERYTHING FIRST!
      context.clearRect(0, 0, width, height);

      var elements = svg.selectAll("circle")

      // MULTIPLE COLORS SPEEDUP STEP 2:
      // Loop through each category in the color scale
      // "Technology", "Medicine", etc
      colorScale.domain().forEach(function(category) {

        // MULTIPLE COLORS SPEEDUP STEP 3:
        // Begin a path with the correct fill color
        // just for that category
        context.beginPath()
        context.fillStyle = colorScale(category);

        // MULTIPLE COLORS SPEEDUP STEP 4:
        // Select the elements that will be the 'right' color...
        var drawableElements = elements.filter(function(d) {
          return d.Month === category
        })

        // MULTIPLE COLORS SPEEDUP STEP 5:
        // Only draw the ones that are the right color/category

        drawableElements.each(function(d) {
          var node = d3.select(this);

          var cy = margin.top + parseInt(node.attr("cy"))
          var cx = margin.left + parseInt(node.attr("cx"))
          var radius = node.attr("r");

          // x, y, radius, startAngle, endAngle
          context.moveTo(cx, cy)
          context.arc(cx, cy, radius, 0, 2.5 * Math.PI)
        })

        context.fill()
        context.closePath()



      })

      d3.select("#ghostrender").text(Date.now() - start)
    }

    d3.timer(redraw)

    d3.select("#net-ghost").on('click', function() {
      var sorted = datapoints.sort(function(a, b) {
        return a.Month- b.Month;
      })
      svg.selectAll("circle")
        .data(sorted, function(d) {
          // this is a UNIQUE IDENTIFIER for
          // that particular row so that
          // d3 can keep track of it
          return d.index
        })
        .transition()
        .duration(2500)
        .attr("cy", function(d, i) {
          return 7 * parseInt(i / 110);
        })
        .attr("cx", function(d, i) {
          return 7 * (i % 110);
        })
    });

    d3.select("#industry-ghost").on('click', function() {
      var sorted = datapoints.sort(function(a, b) {
        if(a.day_of_week === b.day_of_week) {
          return 0;
        }
        if(a.day_of_week > b.day_of_week) {
          return 1;
        }
        return -1;
      })

      svg.selectAll("circle")
        .data(sorted, function(d) {
          // this is a UNIQUE IDENTIFIER for
          // that particular row so that
          // d3 can keep track of it
          return d.index
        })
        .transition()
        .duration(2500)
        .attr("cy", function(d, i) {
          return 7 * parseInt(i / 110);
        })
        .attr("cx", function(d, i) {
          return 7 * (i % 110);
        })
    });

    d3.select("#index-ghost").on('click', function() {
      // reverse all of our data points
      var sorted = datapoints.sort(function(a, b) {
        return a.NOTRSAD - b.NOTRSAD;
      })

      // rebind the data
      // then use 'i' to reposition them with their new index
      // the point that was 10,000 is now 0, and 0 is now 10,000
      svg.selectAll("circle")
        .data(sorted, function(d) {
          // this is a UNIQUE IDENTIFIER for
          // that particular row so that
          // d3 can keep track of it
          return d.NOTRSAD
        })
        .transition()
        .attr("fill", "orange")
        .duration(2500)
        .attr("cy", function(d, i) {
          return 5 * parseInt(i / 110);
        })
        .attr("cx", function(d, i) {
          return 5 * (i % 110);
        })

    })

    d3.select("#rverse-ghost").on('click', function ready (error, datapoints) {
    var start = Date.now()

    // loop through every datapoint
    // draw a circle for that datapoint
    context.beginPath()
    datapoints.forEach(function(d, i) {
      var cy = margin.top + 7 * parseInt(i / 110);
      var cx = margin.left + 7 * (i % 110);
      var radius = 2.5;
      context.fillStyle = "orange";
      

      // x, y, radius, startAngle, endAngle
      context.moveTo(cx, cy)
      context.arc(cx, cy, radius, 0, 2 * Math.PI)
    })
    context.fill()
    context.closePath()

    })


  }

})();