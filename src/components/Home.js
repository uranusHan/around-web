import React from 'react';
import $ from 'jquery';
import { Tabs, Button, Spin } from 'antd';
import {API_ROOT, GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY} from "../constants";

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        posts:[],
        error: '',
        loadingGeoLocation: false,
    }
    //it's a lifecycle function, not use arrow function, no need to binding, this keyword is available
    componentDidMount() {
        //loading data
        //geolocation
        if ("geolocation" in navigator) {
            this.setState({loadingGeoLocation: true, error: ''});
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );

        } else {
           this.setState({error: 'geo location not supported!'});
        }
    }
    //auto bind using arrow function
    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation: false, error: ''});
        //destructor
        const {latitude: lat, longitude: lon} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: lat, lon: lon}));
        this.loadNearbyPosts();
    }
    onFailedLoadGeoLocation = (error) => {
        this.setState({loadingGeoLocation: false, error: 'Failed to load geo location!'});
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            // show spin
            return <Spin tip="Loading geo location ..." />
        }
        return null;
    }
    loadNearbyPosts = () => {
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
            method: 'GET',
            header: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            },
        })
            .then((response) => {
                console.log(response);
                this.setState({
                    posts: response
                });
            }, (error) => {
                this.setState({
                    error: error.responseText
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            });

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

