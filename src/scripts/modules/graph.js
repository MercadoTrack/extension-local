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
    show({ item, elem, marketId, itemId }) {
        let { container, canvas, toggleBtn } = DomUtils.initDOM(item.history.length);
        const mtLink = DomUtils.createGoToMTLink(marketId, itemId);
        toggleBtn.parentNode.appendChild(mtLink);
        elem.parentNode.insertBefore(container, elem);
        return new Chart(canvas, Utils.getItemChartOptions(item));
    }
}
