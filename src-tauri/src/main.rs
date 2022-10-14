#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::collections::HashMap;

use sysinfo::{DiskExt, NetworkExt, System, SystemExt};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_system_details])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_system_details() -> HashMap<String, String> {
    let mut sys = System::new_all();
    sys.refresh_all();

    // mutable hashMap to store data
    let mut sys_info = HashMap::<String, String>::new();

    let ram_used = (sys.used_memory() as f32) / (sys.total_memory() as f32) * 100.;
    for (interface_name, ntwk) in sys.networks() {
        sys_info.insert(
            interface_name.to_owned(),
            ntwk.total_packets_received().to_string(),
        );
    }

    for disk in sys.disks() {
        sys_info.insert(
            String::from("Available Storage"),
            disk.available_space().to_string(),
        );
    }

    sys_info.insert(String::from("memoryTotal"), sys.total_memory().to_string());
    sys_info.insert(String::from("memoryUsagePercent"), ram_used.to_string());
    sys_info.insert(String::from("memoryUsed"), sys.used_memory().to_string());
    sys_info.insert(String::from("OS"), sys.long_os_version().unwrap());
    // sys_info.insert(String::from("kernelVersion"), sys.kernel_version().unwrap());
    // sys_info.insert(String::from("hostName"), sys.host_name().unwrap());
    sys_info.insert(String::from("cpuCores"), sys.cpus().len().to_string());

    return sys_info;
}
