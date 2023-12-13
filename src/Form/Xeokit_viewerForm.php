<?php

namespace Drupal\xeokit_viewer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class Xeokit_viewerForm extends FormBase {
    public function getFormId() {
        return "exokit_viewer_form";
    }

    public function buildForm(array $form, FormStateInterface $form_state) {
        // $form = parent::buildForm($form, $form_state);
        $config = $this->config("xeokit_viewer.settings");

        $form["section_display"] = [
            '#type' => 'fieldset',
            '#title' => $this->t('Display options'),
            '#collapsible' => FALSE,
            '#collapsed' => FALSE,
        ];
        $form["section_display"]["edges"] = [
            "#type"=> "checkbox",
            "#title" => $this->t("Show geometry outlines"),
            "#default_value"=> $config->get("edges"),
        ];
        // Camera settings

        $form["section_position"] = [
            '#type' => 'fieldset',
            '#title' => $this->t('Camera position'),
            '#collapsible' => FALSE,
            '#collapsed' => FALSE,
        ];

        $position_x = $config->get("position_x");
        if (!$position_x) {
            $position_x = -3.933;
        }
        else {
            $position_x = (float)$position_x;
        }
        $position_y = $config->get("position_y");
        if (!$position_y) {
            $position_y = 2.855;
        }
        else {
            $position_y = (float)$position_y;
        }
        $position_z = $config->get("position_z");
        if (!$position_z) {
            $position_z = 27.018;
        }
        else {
            $position_z = (float)$position_z;
        }
        $form["section_position"]["position_x"] = [
            "#type"=> "number",
            "#title" => $this->t("Position X"),
            "#default_value"=> (float)$position_x,
            "#step" => 0.000001,
        ];
        $form["section_position"]["position_y"] = [
            "#type"=> "number",
            "#title" => $this->t("Position Y"),
            "#default_value" => (float)$position_y,
            "#step" => 0.000001,
        ];
        $form["section_position"]["position_z"] = [
            "#type"=> "number",
            "#title" => $this->t("Position Z"),
            "#default_value" => (float)$position_z,
            "#step" => 0.000001,
        ];

        $form["section_look"] = [
            '#type' => 'fieldset',
            '#title' => $this->t('Camera look at vector'),
            '#collapsible' => FALSE,
            '#collapsed' => FALSE,
        ];

        $vector_look_x = $config->get("look_x");
        if (!$vector_look_x) {
            $vector_look_x = 4.400;
        }
        $vector_look_y = $config->get("look_y");
        if (!$vector_look_y) {
            $vector_look_y = 3.724;
        }
        $vector_look_z = $config->get("look_z");
        if (!$vector_look_z) {
            $vector_look_z = 8.899;
        }
        $form["section_look"]["look_x"] = [
            "#type"=> "number",
            "#title" => $this->t("Vector X"),
            "#default_value" => (float)$vector_look_x,
            "#step" => 0.000001,
        ];
        $form["section_look"]["look_y"] = [
            "#type"=> "number",
            "#title" => $this->t("Vector Y"),
            "#default_value" => (float)$vector_look_y,
            "#step" => 0.000001,
        ];
        $form["section_look"]["look_z"] = [
            "#type"=> "number",
            "#title" => $this->t("Vector Z"),
            "#default_value" => (float)$vector_look_z,
            "#step" => 0.000001,
        ];

        $form["section_up"] = [
            '#type' => 'fieldset',
            '#title' => $this->t('Camera up vector'),
            '#collapsible' => FALSE,
            '#collapsed' => FALSE,
        ];
        $vector_up_x = $config->get("up_x");
        if (!$vector_up_x) {
            $vector_up_x = -0.018;
        }
        $vector_up_y = $config->get("up_y");
        if (!$vector_up_y) {
            $vector_up_y = 0.999;
        }
        $vector_up_z = $config->get("up_z");
        if (!$vector_up_z) {
            $vector_up_z = 0.039;
        }
        $form["section_up"]["up_x"] = [
            "#type"=> "number",
            "#title" => $this->t("Vector X"),
            "#default_value" => (float)$vector_up_x,
            "#step" => 0.000001,
        ];
        $form["section_up"]["up_y"] = [
            "#type"=> "number",
            "#title" => $this->t("Vector Y"),
            "#default_value" => (float)$vector_up_y,
            "#step" => 0.000001,
        ];
        $form["section_up"]["up_z"] = [
            "#type"=> "number",
            "#title" => $this->t("Vector Z"),
            "#default_value" => (float)$vector_up_z,
            "#step" => 0.000001,
        ];

        // Action buttons
        $form['actions']['#type'] = 'actions';
        $form['actions']['submit'] = [
            '#type' => 'submit',
            '#value' => $this->t('Save'),
            '#button_type' => 'primary',
        ];
        return $form;
    }

    public function validateForm(array &$form, FormStateInterface $form_state) {
    }

    public function submitForm(array &$form, FormStateInterface $form_state) {
        $config = \Drupal::configFactory()->getEditable('xeokit_viewer.settings');
        $values = $form_state->getValues();
        $this->messenger()->addStatus($this->t('Saved configuration'));
        $config->set('edges', $values['edges']);

        $config->set('position_x', $values['position_x']);
        $config->set('position_y', $values['position_y']);
        $config->set('position_z', $values['position_z']);
        $config->set('look_x', $values['look_x']);
        $config->set('look_y', $values['look_y']);
        $config->set('look_z', $values['look_z']);
        $config->set('up_x', $values['up_x']);
        $config->set('up_y', $values['up_y']);
        $config->set('up_z', $values['up_z']);

        $config->save();
        drupal_flush_all_caches();
    }
}