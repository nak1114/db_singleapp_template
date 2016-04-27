var DBapp = DBapp || {};
DBapp.stack = function() {
	this.svg=undefined;
	this.str=undefined;
};
DBapp.stack.prototype = {
	remove : function(){
		if(this.svg){this.svg.remove();return this;}
	},
    set_css   : function(c){this.css=c;return this;},
    set_option: function(o){this.option=o;return this;},
    set_data  : function(d){this.data=d;return this;},
    css : ( function() {
            return (function () {/*
		.axis path, .axis line {
		    fill: none;
		    stroke: black;
		    shape-rendering: crispEdges;
		}
		.axis text {
		    font-family: Meiryo;
		    font-size: 11px;
		}
		.legend text {
		    font-family: Meiryo;
		}
		.dataset text {
		    font-family: Meiryo;
		}
            */}).toString().match(/\/\*\s*\n\s*([^]*)\r?\n\s*\*\//)[1].replace(/\r?\n\s*/g, '');
    }()),
    option : {
    	width:500,
    	height:200,
    	margins:{top: 12,left: 48, right: 10, bottom: 24},
    	legend:{
    		width:{max:120,min:0},
    		height:{max:999,min:0},
    		margins:{top: 8,left: 8, right: 8, bottom: 8},
    	},
    },
    data: [{
	        data: [{
	            name: 'ほげ',
	            count: 123
	        }, {
	            name: 'Sep',
	            count: 234
	        }, {
	            name: 'Oct',
	            count: 345
	        }],
	        name: 'Series #1'
	    }, {
	        data: [{
	            name: 'ほげ',
	            count: 235
	        }, {
	            name: 'Sep',
	            count: 267
	        }, {
	            name: 'Oct',
	            count: 573
	        }],
	        name: 'Sssssssseries #2'
	    }
    ],
    draw : function(node,datum,opt) {
        var datum=datum||this.data;
        var opt=opt||this.option;
    	var translate=function(s,x,y){s.attr('transform', 'translate(' + x + ',' + y + ')');};
		var margins = opt.margins;
	    var colors = d3.scale.category10();
		var series = datum.map(function (d, i) {
	        return d.name;
	    });
		var dataset = datum.map(function (d) {
	        return d.data.map(function (o) {
	            return {
	                y: o.count,
	                x: o.name
	            };
	        });
		});
		d3.layout.stack()(dataset);









	    var svg = d3.select(node)
	        .append('svg')
	        .attr('width', opt.width)
	        .attr('height', opt.height);
        svg.append('defs').append('style').attr("type","text/css").text(this.css);
	    var root=svg
	        .append('g')
	        .call(translate,margins.left,margins.top);

	    var groups = root.selectAll('g')
	        .data(dataset)
	        .enter()
	        .append('g')
	        .attr('class', 'dataset')
	        .style('fill', function (d, i) {
	        return colors(i);
	    });

		var legend=root.append('g')
		    .attr('class', 'legend')
		    ;
		legend.append('rect')
		    .attr('class', 'bg')
		    .attr('fill', 'yellow')
		    .attr('width', 0)
		    .attr('height', 0)
		    .attr('x', 0)
		    .attr('y', 0);
		series.forEach(function (s, i) {
		    legend.append('rect')
		        .attr('fill', colors(i))
		        .attr('width', 20)
		        .attr('height', 20)
		        .attr('x',          opt.legend.margins.left)
		        .attr('y', i * 24 + opt.legend.margins.top+1);
		    legend.append('text')
		        .attr('fill', 'black')
		        .attr('y', i * 24  + opt.legend.margins.top + 15)
		        .attr('x',           opt.legend.margins.left + 22)
		        .text(s);
		});
		var legend_width =legend.node().getBBox().width +opt.legend.margins.left+opt.legend.margins.right;
		var legend_height=legend.node().getBBox().height+opt.legend.margins.top +opt.legend.margins.bottom;
		if(legend_width>opt.legend.width.max)legend_width=opt.legend.width.max;
		if(legend_width<opt.legend.width.min)legend_width=opt.legend.width.min;
		if(legend_height>opt.legend.height.max)legend_height=opt.legend.height.max;
		if(legend_height<opt.legend.height.min)legend_height=opt.legend.height.min;

		var width = opt.width - margins.left - margins.right - legend_width;
		var height = opt.height - margins.top - margins.bottom;

	    var yMax = d3.max(dataset, function (group) {
	        return d3.max(group, function (d) {
	            return d.y + d.y0;
	        });
	    });
	    var yScale = d3.scale.linear()
	        .domain([yMax, 0])
	        .range([0, height]);
	    var items = dataset[0].map(function (d) {
	        return d.x;
	    });
	    var xScale = d3.scale.ordinal()
	        .domain(items)
	        .rangeRoundBands([0, width], .1);
	    var xAxis = d3.svg.axis()
	        .scale(xScale)
	        .orient('bottom');
	    var yAxis = d3.svg.axis()
	        .scale(yScale)
	        .orient('left');
	    var nodes = groups.selectAll('rect')
	        .data(function(d){return d;})
	        .enter()
	        .append('g')
	        .attr('transform', function(d){return 'translate(' + xScale(d.x) + ',' + yScale(d.y0+d.y) + ')';})
	        .call(function(s){s
		        .append('rect')
		        .attr('x', 0)
		        .attr('y', 0)
		        .attr('height',function(d){return yScale(yMax-d.y);})
		        .attr('width' ,function(d){return xScale.rangeBand();})
			;})
	        .call(function(s){s
		        .append('text')
		        .attr('fill', 'black')
		        .text(function(d){return d.y;})
		        .attr('text-anchor', 'middle')
		        .attr('x', function(d){return xScale.rangeBand()/2;})
		        .attr('y', 16)
	        ;})
			;

	    root.append('g')
	        .attr('class', 'axis')
	        .attr('transform', 'translate(0,' + height + ')')
	        .call(xAxis)
	        .selectAll('text')
	        .attr('dy', 0)
	        .attr('y', 16)
	        ;

		root.append('g')
		    .attr('class', 'axis')
		    .call(yAxis)
	        .selectAll('text')
	        .attr('dy', 0)
	        .attr('y', 4)
	        ;

		legend
	        .attr('transform', 'translate('+(width)+',0)')
	        .select('.bg')
		    .attr('width' , legend_width)
		    .attr('height', legend_height)
		    ;

	    this.svg=svg;
	    this.str=(new XMLSerializer()).serializeToString(svg[0][0]);
	    return this;
   },
};

