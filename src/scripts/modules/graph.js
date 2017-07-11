import Chart from 'chart.js'
import DomUtils from './utils/dom.utils'
import Utils from './utils/utils'

const defaults = {
    defaultFontSize: 15,
    legend: { display: false }
};

/* chart defaults */
Object.assign(Chart.defaults.global, defaults);

export default {
    show(item, $elem) {
        let { container, canvas } = DomUtils.initDOM(item.history.length);
        $elem.parentNode.insertBefore(container, $elem);
        return new Chart(canvas, Utils.getItemChartOptions(item));
    }
}
