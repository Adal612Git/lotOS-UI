use eframe::egui;

struct DemoApp {
    show_dialog: bool,
}

impl Default for DemoApp {
    fn default() -> Self {
        Self { show_dialog: false }
    }
}

impl eframe::App for DemoApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::TopBottomPanel::top("header").show(ctx, |ui| {
            ui.add_space(10.0);
            ui.heading("LotOS UI Rust Desktop Demo");
            ui.label("A native Rust control shell aligned with the same product surface.");
            ui.add_space(6.0);
        });

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.spacing_mut().item_spacing = egui::vec2(14.0, 14.0);

            ui.columns(3, |columns| {
                let items = [
                    ("Queue", "19", "Items waiting"),
                    ("Throughput", "98.4%", "Current completion rate"),
                    ("Escalations", "2", "Manual reviews pending"),
                ];

                for (index, column) in columns.iter_mut().enumerate() {
                    let (label, value, helper) = items[index];
                    egui::Frame::group(column.style())
                        .fill(egui::Color32::from_rgb(18, 29, 46))
                        .show(column, |ui| {
                            ui.label(egui::RichText::new(label).small().strong());
                            ui.label(egui::RichText::new(value).size(28.0).strong());
                            ui.label(helper);
                        });
                }
            });

            ui.separator();
            ui.heading("Runtime delivery matrix");

            egui::Grid::new("runtime-grid")
                .striped(true)
                .spacing(egui::vec2(24.0, 10.0))
                .show(ui, |ui| {
                    ui.strong("Runtime");
                    ui.strong("Status");
                    ui.strong("Delivery");
                    ui.end_row();

                    for row in [
                        ("React", "Stable", "Public package"),
                        (".NET", "Stable", "Desktop and adapter"),
                        ("Java", "Ready", "Desktop demo"),
                        ("Rust", "Ready", "Desktop demo"),
                    ] {
                        ui.label(row.0);
                        ui.label(row.1);
                        ui.label(row.2);
                        ui.end_row();
                    }
                });

            ui.separator();

            ui.horizontal(|ui| {
                if ui.button("Open delivery modal").clicked() {
                    self.show_dialog = true;
                }

                ui.label("This desktop shell is intended as a production-ready demo surface.");
            });
        });

        if self.show_dialog {
            egui::Window::new("LotOS Delivery")
                .collapsible(false)
                .resizable(false)
                .show(ctx, |ui| {
                    ui.label("Rust desktop demo is running.");
                    ui.label("This is the native shell for delivery workflows.");
                    ui.add_space(8.0);

                    if ui.button("Close").clicked() {
                        self.show_dialog = false;
                    }
                });
        }
    }
}

fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([980.0, 640.0]),
        ..Default::default()
    };

    eframe::run_native(
        "LotOS UI Rust Desktop Demo",
        options,
        Box::new(|_cc| Ok(Box::new(DemoApp::default()))),
    )
}
