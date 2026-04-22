
<script>
import { TrainerService } from "@/services/trainer.service";
import { SessionManager } from "@/utils/session.manager";
import { UserService } from "@/services/user.service";

export default {
  data() {
    return {
      trainers: [],
      selectedTrainers: [],
      selectedTimeSlot: {},
      selectedTrainersWithTimeSlot: []
    };
  },
  async created() {
    
    await this.fetchTrainers();
    await this.fetchSelectedTrainers();

    if (!SessionManager.hasAuth()) {
      this.$router.push("/login");
    }
    
  },
  methods: {
    async fetchTrainers() {
      try {
        const response = await TrainerService.getAllTrainers();
        this.trainers = response.data;
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    },
    async fetchSelectedTrainers() {
      try {
        if (!SessionManager.hasAuth()) {
          return;
        }
        const user = await UserService.getUserProfile();
        const userId = user.data.id;
        const response = await TrainerService.getSelectedTrainers(userId);

        const trainers = response.data;
        const trainerIds = trainers.map(trainer => trainer.trainer_id);
        const timeSlots = trainers.map(trainer => trainer.timeSlot_id);

        const selectedTimeSlot = [];
        for (const timeslot of timeSlots) {
          const timeSlot = await TrainerService.getTimeSlots(timeslot);
          selectedTimeSlot.push(timeSlot.data);
        }
        const selectedTrainers = [];
        for (const trainerId of trainerIds) {
          const trainer = await TrainerService.getTrainerById(trainerId);
          selectedTrainers.push(trainer.data);
        }

        
        this.selectedTrainers = selectedTrainers;
        this.selectedTimeSlot = selectedTimeSlot;
        this.selectedTrainersWithTimeSlot = selectedTrainers.map((trainer, index) => ({
          ...trainer,
          timeSlot: selectedTimeSlot[index]
        }));

      } catch (error) {
        console.error("Failed to fetch selected Cars:", error);
      }
    },
    isTrainerSelected(trainerId) {
      return this.selectedTrainers.some(trainer => trainer.id === trainerId);
    },
    async selectTrainer(trainerId, timeSlotId) {
      const user = await UserService.getUserProfile();
      try {
        await TrainerService.pickTrainer(trainerId, user.data.id, timeSlotId);
        await this.fetchSelectedTrainers(); // Refresh the list of selected Nail artists
      } catch (error) {
        console.error("Failed to select Cars:", error);
      }
    },
    async removeTrainer(trainerId) {
      const user = await UserService.getUserProfile();
      try {
        await TrainerService.unpickTrainer(trainerId, user.data.id);
        await this.fetchSelectedTrainers();
      } catch (error) {
        console.error("Failed to remove cars", error);
      }
    }
  },
  computed: {
    availableTrainers() {
      return this.trainers.filter(trainer => !this.isTrainerSelected(trainer.id));
    }
  }

};
</script>
<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-7">
        <h1 class="mb-2">Available cars for rent</h1>
        <div class="row row-cols-2 g-2">
          <div v-for="trainer in availableTrainers" :key="trainer.id" class="col mb-4">
            <div class="card profile-card">
              <div class="card-body">
                <h5 class="card-title">{{ trainer.name }}</h5>
                <p class="card-text">{{ trainer.speciality }}</p>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <label for="timeSlot" class="form-label">Select Time Slot</label>
                    <select v-model="selectedTimeSlot[trainer.id]" class="form-select" aria-label="Select time slot">
                      <option v-for="timeSlot in trainer.timeSlots" :key="timeSlot.id" :value="timeSlot.id">{{ timeSlot.slot }}</option>
                    </select>
                    <button v-if="!isTrainerSelected(trainer.id)" class="btn btn-primary btn-sm ms-1 mt-2" @click="selectTrainer(trainer.id, selectedTimeSlot[trainer.id])">Add</button>
                    <button v-else class="btn btn-secondary btn-sm ms-1 mt-2" disabled>Added</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <h2 class="mb-4">Selected cars</h2>
        <ul class="list-group">
          <li class="list-group-item" v-for="selectedTrainer in selectedTrainersWithTimeSlot" :key="selectedTrainer.id">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                {{ selectedTrainer.name }} - {{ selectedTrainer.speciality }} {{ selectedTrainer.timeSlot.slot }} 
              </div>
              <button class="btn btn-danger btn-sm" @click="removeTrainer(selectedTrainer.id)">Remove</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.profile-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-card .card-body {
  padding: 20px;
}

.profile-card .card-title {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.profile-card .card-text {
  font-size: 1.1rem;
  color: #666;
}

.profile-card .list-group-item {
  border: none;
}
</style>
