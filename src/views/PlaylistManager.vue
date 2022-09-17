<template lang="">
<layout-page>
    <!-- <v-snackbar v-model="sent" :timeout="4000" :color="isChanged ? 'success' : 'error'">
            {{ this.groupChangeMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn text white v-bind="attrs" @click="sent = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar> -->
    <div>
        <v-row>
            <v-col cols="2">
                <v-card class="mx-auto">
                    <v-card-title>Select a playlist</v-card-title>
                    <v-card-text class="mt-2">
                        <div>
                            <!-- <div class="text-body-2">Playlist</div> -->
                            <v-autocomplete v-model="selectedPlaylist" outlined dense label="Playlist" :items="playlists" item-text="name" item-value="name"></v-autocomplete>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="mx-auto">
                    <v-card-text>
                        <v-row>
                            <v-col class="pt-0">
                                <v-card  elevation="0">
                                    <v-card-title>
                                        All assets
                                    </v-card-title>
                                        <div style="border: 0.5px solid black; background-color:#d3d3d3;max-height:600px;height:600px;overflow-y:auto;overflow-x:hidden" class="rounded px-12">
                                            <draggable class="list-group" :list="allAssets" group="assets" style="max-height:600px;height:600px;">
                                                <v-card class="mt-4 item" v-for="(asset, index) in allAssets" :key="index">
                                                    <v-card-text>{{asset.name}}</v-card-text>
                                                </v-card>
                                            </draggable>
                                        </div>
                                </v-card>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col class="pt-0">
                                <v-card  elevation="0">
                                    <v-card-title>
                                        Selected assets
                                    </v-card-title>
                                        <div style="border: 0.5px solid black; background-color:#d3d3d3;max-height:600px;height:600px;overflow-y:auto;overflow-x:hidden" class="rounded px-12">
                                            <draggable class="list-group" :list="selectedAssets" group="assets" style="max-height:600px;height:600px;">
                                                <v-card class="mt-4 item" v-for="(asset, index) in selectedAssets" :key="index">
                                                    <v-card-text>{{asset.name}}</v-card-text>
                                                </v-card>
                                            </draggable>
                                        </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>

</layout-page>
</template>

<script>
import LayoutPage from '../layout/PlayerLayoutPage.vue';
import axios from 'axios';
import draggable from 'vuedraggable'

export default {
    components: {
        LayoutPage,
        draggable
    },
    data() {
        return {
            playlists: [],
            selectedPlaylist: null,
            allAssets: [],
            selectedAssets: [],
        }
    },

    methods: {
        getPlaylists() {
            axios.get('http://172.17.0.20:3000/api/playlists', {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                this.playlists = resp.data.data
                this.selectedPlaylist = this.playlists[0].name

            }).catch((err) => {
                console.log(err)
            })
        },
        getAllAssets() {
            axios.get('http://172.17.0.20:3000/api/files', {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                this.allAssets = resp.data.data.dbdata
            }).catch((err) => {
                console.log(err)
            })
        }
    },

    mounted() {
        this.getPlaylists()
        this.getAllAssets()
    }
}
</script>

<style>
/* Cool hovering effect */
.item {
    cursor: pointer;
    transition: all 0.25s ease;
}

.item:hover {
    transform: scale(1.1, 1.1);
}
/* Cool hovering effect */
</style>
