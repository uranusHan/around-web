import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import {GEO_OPTIONS, POS_KEY} from "../constants";

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,

    }
    //it's a lifecycle function, not use arrow function, no need to binding, this keyword is available
    componentDidMount() {
        //loading data
        //geolocation
        if ("geolocation" in navigator) {
            this.setState({loadingGeoLocation: true});
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );

        } else {
           console.log('geo location not supported!');
        }
    }
    //auto bind using arrow function
    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation: false});
        //destructor
        const {latitude: lat, longitude: lon} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: lat, lon: lon}));
    }
    onFailedLoadGeoLocation = () => {
        this.setState({loadingGeoLocation: false});
    }

    getGalleryPanelContent = () => {
        if (this.state.loadingGeoLocation) {
            // show spin
            return <Spin tip="Loading geo location ..." />
        }
        return null;
    }
    render() {
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    Content of tab 2
                </TabPane>
            </Tabs>
        );
    }
}

