import React from "react";
import { StyleSheet, Text, View, TabBarIOS } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Feed from "./Feed";
import Canvas from "./Canvas";
import DummySignOut from "./DummySignOut";
import Profile from "./Profile";

const starOutline =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMTEuODM2NDIybW0iCiAgIGhlaWdodD0iMTEuMjk1MzI0bW0iCiAgIHZpZXdCb3g9IjAgMCAxMS44MzY0MjIgMTEuMjk1MzI0IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc4IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjIgKDVjM2U4MGQsIDIwMTctMDgtMDYpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJzdGFyLW91dGxpbmUuc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iMi44IgogICAgIGlua3NjYXBlOmN4PSI4Mi45NzIxMTgiCiAgICAgaW5rc2NhcGU6Y3k9Ii04LjgwMzYwMTciCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTMiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii05IgogICAgIGlua3NjYXBlOndpbmRvdy15PSI5NiIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01Ny42MzA2NCwtMjcuNTI3OTg3KSI+CiAgICA8cGF0aAogICAgICAgc29kaXBvZGk6dHlwZT0ic3RhciIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjA7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuNzkzNzQ5OTk7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJwYXRoODI1IgogICAgICAgc29kaXBvZGk6c2lkZXM9IjUiCiAgICAgICBzb2RpcG9kaTpjeD0iNDYuOTI5NzA3IgogICAgICAgc29kaXBvZGk6Y3k9IjIxLjA5MDQ4MyIKICAgICAgIHNvZGlwb2RpOnIxPSI1LjgwNTkyNTgiCiAgICAgICBzb2RpcG9kaTpyMj0iMi45Mjc1NTUxIgogICAgICAgc29kaXBvZGk6YXJnMT0iLTEuNTcwNzk2MyIKICAgICAgIHNvZGlwb2RpOmFyZzI9Ii0wLjk0MjQ3Nzc3IgogICAgICAgaW5rc2NhcGU6ZmxhdHNpZGVkPSJmYWxzZSIKICAgICAgIGlua3NjYXBlOnJvdW5kZWQ9IjAuMDIiCiAgICAgICBpbmtzY2FwZTpyYW5kb21pemVkPSIwLjAwMDQ3MTEwMyIKICAgICAgIGQ9Im0gNDYuOTI5ODA4LDE1LjI4NjIyMyBjIDAuMDc2ODksLTQuM2UtNSAxLjY1OTExOSwzLjM4ODI2NCAxLjcyMTMwMywzLjQzMzQ0NSAwLjA2MjE4LDAuMDQ1MTggMy43NzQyMDYsMC41MDA4NzIgMy43OTgwMDIsMC41NzM5NjEgMC4wMjM4LDAuMDczMDkgLTIuNzEyMjA0LDIuNjI5NTY3IC0yLjczNjAxOCwyLjcwMjY4MyAtMC4wMjM4MiwwLjA3MzEyIDAuNjkyMzAyLDMuNzQ0MDU3IDAuNjMwMTI3LDMuNzg5MyAtMC4wNjIxOCwwLjA0NTI0IC0zLjMzNjU2NiwtMS43Njc5MDYgLTMuNDEzNDU2LC0xLjc2NzkyOSAtMC4wNzY4OSwtMi4yZS01IC0zLjM0OTY1MiwxLjgxNTM0NiAtMy40MTE4MzEsMS43NzAxMSAtMC4wNjIxOCwtMC4wNDUyNCAwLjY1Mzg2NywtMy43MTc4NTUgMC42MzAwODgsLTMuNzkwOTcxIC0wLjAyMzc4LC0wLjA3MzEyIC0yLjc2NTMxMiwtMi42MjcxMDQgLTIuNzQxNTIxLC0yLjcwMDIwMiAwLjAyMzc5LC0wLjA3MzEgMy43NDEyNTQsLTAuNTI3NDc5IDMuODAzNDY0LC0wLjU3MjYzNiAwLjA2MjIxLC0wLjA0NTE2IDEuNjQyOTU0LC0zLjQzNzcxOSAxLjcxOTg0MiwtMy40Mzc3NjEgeiIKICAgICAgIGlua3NjYXBlOnRyYW5zZm9ybS1jZW50ZXIteD0iMC4wMDEyODUwMDgyIgogICAgICAgaW5rc2NhcGU6dHJhbnNmb3JtLWNlbnRlci15PSItMC41NTQwMzQyIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuNjIxMDQ2LDEyLjYzODYzOSkiIC8+CiAgPC9nPgo8L3N2Zz4K";
const starFilled =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMTEuODM2NDIybW0iCiAgIGhlaWdodD0iMTEuMjk1MzI0bW0iCiAgIHZpZXdCb3g9IjAgMCAxMS44MzY0MjIgMTEuMjk1MzI0IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc4IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjIgKDVjM2U4MGQsIDIwMTctMDgtMDYpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJzdGFyLWZpbGxlZC5zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSIyLjgiCiAgICAgaW5rc2NhcGU6Y3g9IjgyLjk3MjExOCIKICAgICBpbmtzY2FwZTpjeT0iLTguODAzNjAxNyIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxMyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTkiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ijk2IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU3LjYzMDY0LC0yNy41Mjc5ODcpIj4KICAgIDxwYXRoCiAgICAgICBzb2RpcG9kaTp0eXBlPSJzdGFyIgogICAgICAgc3R5bGU9ImZpbGw6Izg4NmJlYTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6Izg4NmJlYTtzdHJva2Utd2lkdGg6MC43OTM3NDk5OTtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgaWQ9InBhdGg4MjUiCiAgICAgICBzb2RpcG9kaTpzaWRlcz0iNSIKICAgICAgIHNvZGlwb2RpOmN4PSI0Ni45Mjk3MDciCiAgICAgICBzb2RpcG9kaTpjeT0iMjEuMDkwNDgzIgogICAgICAgc29kaXBvZGk6cjE9IjUuODA1OTI1OCIKICAgICAgIHNvZGlwb2RpOnIyPSIyLjkyNzU1NTEiCiAgICAgICBzb2RpcG9kaTphcmcxPSItMS41NzA3OTYzIgogICAgICAgc29kaXBvZGk6YXJnMj0iLTAuOTQyNDc3NzciCiAgICAgICBpbmtzY2FwZTpmbGF0c2lkZWQ9ImZhbHNlIgogICAgICAgaW5rc2NhcGU6cm91bmRlZD0iMC4wMiIKICAgICAgIGlua3NjYXBlOnJhbmRvbWl6ZWQ9IjAuMDAwNDcxMTAzIgogICAgICAgZD0ibSA0Ni45Mjk4MDgsMTUuMjg2MjIzIGMgMC4wNzY4OSwtNC4zZS01IDEuNjU5MTE5LDMuMzg4MjY0IDEuNzIxMzAzLDMuNDMzNDQ1IDAuMDYyMTgsMC4wNDUxOCAzLjc3NDIwNiwwLjUwMDg3MiAzLjc5ODAwMiwwLjU3Mzk2MSAwLjAyMzgsMC4wNzMwOSAtMi43MTIyMDQsMi42Mjk1NjcgLTIuNzM2MDE4LDIuNzAyNjgzIC0wLjAyMzgyLDAuMDczMTIgMC42OTIzMDIsMy43NDQwNTcgMC42MzAxMjcsMy43ODkzIC0wLjA2MjE4LDAuMDQ1MjQgLTMuMzM2NTY2LC0xLjc2NzkwNiAtMy40MTM0NTYsLTEuNzY3OTI5IC0wLjA3Njg5LC0yLjJlLTUgLTMuMzQ5NjUyLDEuODE1MzQ2IC0zLjQxMTgzMSwxLjc3MDExIC0wLjA2MjE4LC0wLjA0NTI0IDAuNjUzODY3LC0zLjcxNzg1NSAwLjYzMDA4OCwtMy43OTA5NzEgLTAuMDIzNzgsLTAuMDczMTIgLTIuNzY1MzEyLC0yLjYyNzEwNCAtMi43NDE1MjEsLTIuNzAwMjAyIDAuMDIzNzksLTAuMDczMSAzLjc0MTI1NCwtMC41Mjc0NzkgMy44MDM0NjQsLTAuNTcyNjM2IDAuMDYyMjEsLTAuMDQ1MTYgMS42NDI5NTQsLTMuNDM3NzE5IDEuNzE5ODQyLC0zLjQzNzc2MSB6IgogICAgICAgaW5rc2NhcGU6dHJhbnNmb3JtLWNlbnRlci14PSIwLjAwMTI4NTAwODIiCiAgICAgICBpbmtzY2FwZTp0cmFuc2Zvcm0tY2VudGVyLXk9Ii0wLjU1NDAzNDIiCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNi42MjEwNDYsMTIuNjM4NjM5KSIgLz4KICA8L2c+Cjwvc3ZnPgo=";

class MainFiveTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "featured"
    };
    this.navigation = props.navigation;
  }

  render() {
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
          selected={this.state.selectedTab === "featured"}
          icon={{ uri: starOutline, scale: 2 }}
          selectedIcon={{ uri: starFilled, scale: 2 }}
          title="featured"
          onPress={() => {
            this.setState({
              selectedTab: "featured"
            });
          }}
        >
          <Feed nav={this.navigation} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          selected={this.state.selectedTab === "search"}
          systemIcon="search"
          onPress={() => {
            this.setState({
              selectedTab: "search"
            });
          }}
        >
          <Canvas />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          selected={this.state.selectedTab === "more"}
          systemIcon="more"
          onPress={() => {
            this.setState({
              selectedTab: "more"
            });
          }}
        >
          <Feed />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          selected={this.state.selectedTab === "favorites"}
          systemIcon="favorites"
          onPress={() => {
            this.setState({
              selectedTab: "favorites"
            });
          }}
        >
          <DummySignOut navigation={this.navigation} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          selected={this.state.selectedTab === "contacts"}
          systemIcon="contacts"
          onPress={() => {
            this.setState({
              selectedTab: "contacts"
            });
          }}
        >
          <Profile />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

export default MainFiveTabs;
