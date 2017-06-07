import Chart from 'chart.js'
import DomUtils from './utils/dom.utils'
import Utils from './utils/utils'

const Graph = (() => {

    const defaults = {
        defaultFontSize: 15,
        legend: { display: false }
    };

    /* chart defaults */
    Object.assign(Chart.defaults.global, defaults);

    const Graph = {
        show(item, $elem) {
            let canvas = DomUtils.createCanvas();
            let container = DomUtils.createContainer(canvas, item.history.length);
            $elem.parentNode.insertBefore(container, $elem);
            return new Chart(canvas, Utils.getItemChartOptions(item));
        }
    }

    return Graph

})()

export default Graph
