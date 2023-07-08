provider "google" {
  credentials = file("./password_file.json")
  project     = "kubernetes-5409"
  region      = "northamerica-northeast1"
}

resource "google_container_cluster" "primary" {
  name               = "kube-cluster"
  location           = "northamerica-northeast1-a"
  remove_default_node_pool = true
	initial_node_count       = 1
}

resource "google_container_node_pool" "primary_nodes" {
		name = "kube-node"
		location = "northamerica-northeast1-a"
		cluster = google_container_cluster.primary.name
		node_count = 1

  node_config {
      machine_type = "e2-medium"
      disk_size_gb = 10
      disk_type    = "pd-standard"
      image_type   = "COS_CONTAINERD"
   }
}

resource "null_resource" "get_credentials" {
  depends_on = [google_container_cluster.primary]
  provisioner "local-exec" {
    command = "gcloud container clusters get-credentials kube-cluster --location=northamerica-northeast1-a"
  }
}

resource "null_resource" "kubectl_apply" {
  depends_on = [null_resource.get_credentials]
  provisioner "local-exec" {
    command = "kubectl apply -f kube-storage.yml"
    working_dir = path.module
  }
}
