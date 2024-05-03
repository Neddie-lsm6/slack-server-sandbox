import { ChatService } from './chat.service';
import { ChannelCreateEventDto } from './event.challange.dto';
import { ChatDto } from './chat.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { postFormData } from './slack-api';
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import url = require('url')

@Controller('/flex')
export class FlexController {
  constructor(private readonly chatService: ChatService) {}

  client: Axios = axios.create({});
  access_token = '';
  last_token_update_ts = 0;

  getUnixTimestamp(): number {
    return Math.floor(+new Date() / 1000)
  }

  // Access token 갱신
  async updateAccessToken() {
    const refresh_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJSZWZyZXNoIiwiY2loIjoidll6Um5iZ3paMyIsImV4cCI6MTcxNDk2MjI5NiwiaWF0IjoxNzE0MzU3NDk2LCJ3aWgiOiJZRzBkcU15endlIiwic2lkIjoiYTQxMjg4NjgtMGEzNS00MTFjLWIzZDktNWQ1NGYyYmM1ZjYwIn0.B4jsu94vC4fJ1tPKDm0s79OPvN0FDGT_69etJn7vvzA';

    const current_timestamp = this.getUnixTimestamp();
    if (this.access_token === '' || this.last_token_update_ts > current_timestamp) {
      try {
        const params = new url.URLSearchParams({
          'grant_type': 'refresh_token',
          'client_id': 'open-api',
          'refresh_token': refresh_token
        })

        const response = await this.client.post(
          'https://openapi.flex.team/v2/auth/realms/open-api/protocol/openid-connect/token',
          params,
          {headers: {'Content-Type': 'application/x-www-form-urlencoded'}},
        );

      console.log(response.data)
      this.access_token = response.data.access_token
      } catch (error) {
        console.error('Error: ', error);
        this.access_token = ''
      }
    }
    this.last_token_update_ts = this.last_token_update_ts == 0 ? this.getUnixTimestamp() : this.last_token_update_ts + 590;

    return this.access_token;
  }

  @Get()
  async getFlexMemberList(): Promise<string> {
    const access_token = await this.updateAccessToken();
    if (access_token === '') {
      return "NO ACCESS TOKEN"
    }

    let member_num = 0;
    let hasNext = false;
    let nextPageKey = ''
    let entireEmployeeNumbers = [];
    let entireEmployeeDetails = [];

    try {
      do {
        console.log(hasNext, nextPageKey)
        let query_string = 'pageSize=20&' + (nextPageKey === '' ? '' : 'nextPageKey=' + nextPageKey)
        const response = await axios.get(
          'https://openapi.flex.team/v2/users/employee-numbers?' + query_string,
          {headers: {'authorization': 'Bearer ' + access_token}}
        )

        hasNext = response.data.hasNext;
        nextPageKey = response.data.nextPageKey;
        let employeeNumbers = response.data.employeeNumbers;
        entireEmployeeNumbers.push(...employeeNumbers);

        let employeeDetails = await this.getMemberDetails(employeeNumbers);
        entireEmployeeDetails.push(...employeeDetails);

      } while(hasNext);
    } catch (error) {
      console.error('Error: ', error);
      return "Failed"
    }

    // console.log(entireEmployeeNumbers)
    // console.log('Numbers : ', entireEmployeeNumbers.length)
    // const set = new Set(entireEmployeeNumbers);
    // const uniqueNumbers = [...set];

    // console.log(uniqueNumbers, uniqueNumbers.length)
    // console.log(entireEmployeeDetails);

    let fs = require('fs')
    fs.writeFileSync('result.json', JSON.stringify(entireEmployeeDetails));

    return "GOOD";
  }

  async getMemberDetails(id_list: Array<string>): Promise<Array<Object>>{
    const access_token = await this.updateAccessToken();
    if (access_token === '') {
      return null;
    }

    try {
      const id_list_query = id_list.join(',')
      const response = await axios.get(
        'https://openapi.flex.team/v2/user-masters?employeeNumbers=' + id_list_query,
        {headers: {'authorization': 'Bearer ' + access_token}}
      )

      let dto = new Array<Object>;
      Object.assign(dto, response.data.users);
      return dto;
    } catch (error) {
      console.error('Error: ', error);
      return [];
    }
  }

  async getDayoffMembers(): Promise<Array<Object>>{


    return null;
  }
}
