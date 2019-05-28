// tslint:disable:no-string-literal
import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Automated trash job';
  text: any;
  JSONData: any;

  finalList = {};

  showData = [];

  objectKeys = [];
  objectInArray = [];

  csvJSON(csvText) {
    const lines = csvText.split('\n');

    const result = [];

    const headers: string[] = lines[0].split(',');

    for (let i = 1; i < lines.length - 1; i++) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    this.groupByFatherTask(result);
    this.JSONData = JSON.stringify(result);
  }
  convertFile(input) {
    const reader = new FileReader();
    reader.readAsText(input.files[0], 'ISO-8859-1');
    reader.onload = () => {
      const text = reader.result;
      this.text = text;

      this.csvJSON(text);
    };
  }

  groupByFatherTask(result: any[]) {
    const ordered = _.orderBy(result, ['Tarea padre']);

    this.extractDiferenFather(ordered);
    this.loadDataIntoFinalListObject(ordered);
  }

  extractDiferenFather(result: any[]) {
    const uniqueFathers = _.uniq(
      result.map(lineObject => lineObject['Tarea padre'])
    );

    this.loadFinalLIstObject(uniqueFathers);
  }

  loadFinalLIstObject(uniqueFathers: string[]) {
    uniqueFathers.forEach(fatherNumber => {
      if (fatherNumber === '') {
        this.finalList[''] = [];
      } else {
        this.finalList[fatherNumber] = [];
      }
    });
  }

  loadDataIntoFinalListObject(orderedArray: any[]) {
    for (const property in this.finalList) {
      if (this.finalList[property]) {
        this.finalList[property] = _.filter(orderedArray, [
          'Tarea padre',
          property
        ]);
        this.objectInArray.push(this.finalList[property]);
      }
    }
    this.objectKeys = Object.keys(this.finalList);
  }
}
