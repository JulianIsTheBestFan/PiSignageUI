<template lang="">
<layout-page>
    <div>
        <v-snackbar v-model="sent" :timeout="4000" :color="isChanged ? 'success' : 'error'">
            {{ this.groupChangeMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn text white v-bind="attrs" @click="sent = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-card width="40%" class="mx-auto">
            <v-card-title>Player Management</v-card-title>
            <v-card-text class="mt-2">
                <div>
                    <div class="text-body-2">Player</div>
                    <v-select v-model="selectedPlayer" :items="players" item-text="name" item-value="_id">
                        <template v-slot:item="data">
                            <div class="mx-auto">
                                <div>
                                    <span>{{ data.item.name }}</span>
                                    <span>
                                        <v-icon x-large :color="data.item.isConnected ? 'success' : 'error'">mdi-circle-small</v-icon>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </v-select>
                </div>
                <div class="mt-2">
                    <div class="text-body-2">Group</div>
                    <v-select v-model="selectedGroup" :items="groups" item-text="Pname" item-value="Pid">
                    </v-select>
                </div>
            </v-card-text>
            <v-card-actions class="mt-2">
                <div class="mx-auto">
                    <div class="text-body-2">Infotext</div>
                    <v-text-field v-model="infoText">
                    </v-text-field>
                    <v-btn @click="removeInfo">
                        <v-icon color="grey darken-2">
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </div>
            </v-card-actions>
            <v-card-actions>
                <v-btn class="mx-auto" @click="postBack">
                    <v-icon large color="grey darken-2">
                        mdi-skip-previous
                    </v-icon>
                </v-btn>
                <v-btn class="mx-auto" @click="postPause">
                    <v-icon large color="grey darken-2">
                        mdi-pause
                    </v-icon>
                </v-btn>
                <v-btn class="mx-auto" @click="postFwd">
                    <v-icon large color="grey darken-2">
                        mdi-skip-next
                    </v-icon>
                </v-btn>
            </v-card-actions>
            <v-card-actions class="mt-2">
                <v-btn block class="mx-auto" @click="updateGroup">
                    <v-icon large color="grey darken-2">
                        mdi-cast-variant
                    </v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</layout-page>
</template>

<script>
import LayoutPage from '../layout/PlayerLayoutPage.vue';
import axios from 'axios';
import {
    playlistBackward
} from "../apiClient/client"
import {
    playlistPause
} from "../apiClient/client"
import {
    playlistForward
} from "../apiClient/client"

export default {
    components: {
        LayoutPage
    },
    data() {
        return {
            selectedPlayer: "1",
            selectedGroup: "1",
            groups: [],
            players: [],
            sent: false,
            isChanged: false,
            groupChangeMessage: "",
            infoText: null
        }

    },

    methods: {

        getPlayerNames() {
            let players = []
            axios.get('http://172.17.0.20:3000/api/players', {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                let data = resp.data.data.objects
                for (let i = 0; i < data.length; i++) {

                    if (data[i].name) {
                        players.push({
                            _id: data[i]._id,
                            name: data[i].name,
                            group: data[i].group,
                            isConnected: data[i].isConnected
                        })
                    }
                }
                this.players = players;
                this.selectedPlayer = this.players[0]._id
            }).catch((err) => {
                console.log(err);
            })

        },
        getGroups() {
            let groups = []
            axios.get('http://172.17.0.20:3000/api/groups', {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                let Data = resp.data.data
                for (let i = 0; i < Data.length; i++) {

                    if (Data[i].name) {
                        groups.push({
                            Pname: Data[i].name,
                            Pid: Data[i]._id

                        })
                    }
                }
                this.groups = groups;
                this.selectedGroup = this.players[0].group._id
            }).catch((err) => {
                console.log(err);
            })
        },
        postBack() {
            playlistBackward(this.selectedPlayer,
                (err) => {
                    console.log(err)
                }
            )
        },
        postPause() {
            playlistPause(this.selectedPlayer,
                (err) => {
                    console.log(err)
                }
            )

        },
        postFwd() {
            playlistForward(this.selectedPlayer,
                (err) => {
                    console.log(err)
                }
            )

        },
        updateGroup() {
            axios.post('http://172.17.0.20:3000/api/players/' + this.selectedPlayer, {
                group: {
                    "_id": this.selectedGroup,
                    name: this.getGroupName,
                },

            }, {
                auth: {
                    username: "pi",
                    password: "pi"
                }

            }).then((resp) => {
                if (resp.status == 200) {
                    if (this.infoText != null) {
                        this.updateInfo()
                        console.log("Text" + this.infoText + "wird nun auf Infotafel angezeigt!")
                    }else {
                        console.log("Kein Text vorhanden!")
                        this.removeInfo()
                    }
                    this.isChanged = true
                    this.groupChangeMessage = "Player: " + this.getPlayerName() + " group changed successfully!"
                    this.sent = true
                }

            }).catch((err) => {
                this.groupChangeMessage = err
                this.sent = true
            })
        },

        updateInfo() {
            axios.post('http://172.17.0.20:3000/api/groups/' + this.selectedGroup, {
                emergencyMessage: {
                    enable: true,
                    msg: this.info
                },
            }, {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            })
        },

        removeInfo() {
            axios.post('http://172.17.0.20:3000/api/groups/' + this.selectedGroup, {
                emergencyMessage: {
                    enable: false,
                },
            }, {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            })
        },

        getPlayerName() {
            for (let index in this.players) {
                if (this.players[index]._id == this.selectedPlayer)
                    return this.players[index].name
            }
        },
        getGroupName() {
            for (let index in this.groups) {
                if (this.groups[index]._id == this.selectedGroup)
                    return this.groups[index].Pname
            }
        }
    },
    mounted() {
        this.getPlayerNames()
        this.getGroups()
    }
}
</script>

<style lang="">

</style>
