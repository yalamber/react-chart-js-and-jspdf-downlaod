import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import 'chart.js'
import './App.css'

class App extends Component {
  state = {
    printBarGraph: false,
    chartConfig: {

    }
  }

  data = [
    { 'count': 12, 'data': { 'id': 4, 'creationDate': '2019-06-21T13:33:14.000+0000', 'createdByUserId': null, 'updateDate': '2019-06-21T13:33:14.000+0000', 'updatedByUserId': null, 'code': '', 'value': 'ailani', 'en_label': 'Ailani', 'nep_label': 'अैलानी', 'deleted': false } },
    { 'count': 7, 'data': { 'id': 3, 'creationDate': '2019-06-21T13:33:14.000+0000', 'createdByUserId': null, 'updateDate': '2019-06-21T13:33:14.000+0000', 'updatedByUserId': null, 'code': '', 'value': 'institutional', 'en_label': 'Institutional', 'nep_label': 'बास', 'deleted': false } },
    { 'count': 13, 'data': { 'id': 5, 'creationDate': '2019-06-21T13:33:14.000+0000', 'createdByUserId': null, 'updateDate': '2019-06-21T13:33:14.000+0000', 'updatedByUserId': null, 'code': '', 'value': 'others', 'en_label': 'Others', 'nep_label': 'अन्य', 'deleted': false } },
    { 'count': 153, 'data': { 'id': 1, 'creationDate': '2019-06-21T13:33:14.000+0000', 'createdByUserId': null, 'updateDate': '2019-06-21T13:33:14.000+0000', 'updatedByUserId': null, 'code': '', 'value': 'owned', 'en_label': 'Owned', 'nep_label': 'आफ्नै नाममा', 'deleted': false } },
    { 'count': 4, 'data': { 'id': 2, 'creationDate': '2019-06-21T13:33:14.000+0000', 'createdByUserId': null, 'updateDate': '2019-06-21T13:33:14.000+0000', 'updatedByUserId': null, 'code': '', 'value': 'rented', 'en_label': 'Rented', 'nep_label': 'भाडामा', 'deleted': false } }
  ]

  getData = (canvas) => {
    const data = this.data
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0, '#867845')
    gradient.addColorStop(1, '#292B3C')
    const ctx2 = canvas.getContext('2d')
    const highestGradient = ctx2.createLinearGradient(0, 0, 0, 200)
    highestGradient.addColorStop(0, '#ABACB3')
    highestGradient.addColorStop(1, '#27293D')
    // Get index for Maximum value
    if (data.length === 0) {
      return -1
    }
    var max = data[0].count
    var maxIndex = 0
    for (var i = 1; i < data.length; i++) {
      if (data[i].count > max) {
        maxIndex = i
        max = data[i].count
      }
    }
    let color = []
    // Create array of gradient
    for (i = 0; i < data.length; i++) {
      if (i === maxIndex) {
        color[i] = highestGradient
      } else {
        color[i] = gradient
      }
    }
    // extract 'count' & 'label' from data
    let chartData = []
    let chartLabel = []
    let auxLabel = ''
    let spaceCounter = 0
    for (i = 0; i < data.length; i++) {
      chartData[i] = data[i].count || data[i].pCount
      if (typeof data[i].data === 'undefined') {
        for (var j = 0; j < data[i].pData.en_label.length; j++) {
          if (data[i].pData.en_label.charAt(j) === ' ') {
            spaceCounter++
          }
          if (spaceCounter <= 2) {
            auxLabel += data[i].pData.en_label.charAt(j)
          }
        }
        chartLabel[i] = auxLabel
        auxLabel = ''
        spaceCounter = 0
      } else {
        for (j = 0; j < data[i].data.en_label.length; j++) {
          if (
            data[i].data.en_label.charAt(j) === ' ' ||
            data[i].data.en_label.charAt(j) === '/' ||
            data[i].data.en_label.charAt(j) === '('
          ) {
            spaceCounter++
          }
          if (spaceCounter <= 1) {
            auxLabel += data[i].data.en_label.charAt(j)
          }
        }
        chartLabel[i] = auxLabel
        auxLabel = ''
        spaceCounter = 0
      }
    }
    return {
      labels: chartLabel,
      datasets: [
        {
          label: 'count',
          backgroundColor: color,
          borderColor: '#F3D250',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: chartData
        }
      ]
    }
  }

  onDownload = (chartId) => () => {
    this.setState({
      printBarGraph: true
    }, () => {

      let doc = new jsPDF()
      let canvas = document.getElementById(chartId);
      let canvasImg = canvas.toDataURL("image/png", 1.0);
      doc.setFontSize(30);
      doc.text(15, 15, "Title Text here");

      doc.addImage(canvasImg, 'PNG', 15, 40, 180, 100);

      doc.addPage();
      let tableBodyData = this.data.map((item, key) => {
        return [item.data.en_label, item.count]
      })
      doc.autoTable({
        head: [['Label', 'Count']],
        body: tableBodyData
      })
      doc.save('data.pdf')
      this.setState({
        printBarGraph: false
      })
    })
  }

  render() {
    return (
      <div className='App'>
        <button onClick={this.onDownload('chart1')}>Download</button>
        <Bar
          id="chart1"
          data={this.getData}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],
              title: this.props.labelName,
              titleTextStyle: { color: 'white', fontSize: 30 },
              xAxes: [
                {
                  barThickness: 30,

                  ticks: {
                    fontSize: 11
                  }
                }
              ]
            }
          }}
        />
      </div>
    )
  }
}

export default App
